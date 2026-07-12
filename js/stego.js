/* ============================================
   SHADOW PROTOCOL — STEGO.JS
   Steganografi Laboratuvarı Modülü
   İçerik: Görsel Steganografi (LSB), Isıl Fark Merceği,
           Ses Steganografisi (WAV LSB) ve Canlı Spektrogram
   ============================================ */

const stego = {
    // Görsel Nesneleri
    sourceImage: null,
    encodedImage: null,
    
    // Lens Ayarları
    lensX: 0.5,
    lensMode: 'thermal', // 'thermal' veya 'bw'

    // Ses Verileri
    audioBuffer: null,
    audioCtx: null,
    analyser: null,
    sourceNode: null,
    animationId: null,
    isSpectrogramRunning: false,
    decodedAudioBuffer: null,

    /* ------------------------------------------
       BAŞLATICI
    ------------------------------------------ */
    init() {
        this.initImageStego();
        this.initAudioStego();
    },

    /* ==========================================
       1. GÖRSEL STEGANOGRAFİ (IMAGE LSB)
    ========================================== */
    initImageStego() {
        const imgInput = document.getElementById('stego-img-input');
        const imgUpload = document.getElementById('img-upload-zone');
        const imgPreviewWrap = document.getElementById('img-preview-wrap');
        const sourceImg = document.getElementById('source-img-preview');
        const imgDims = document.getElementById('img-dims');

        const imgDecodeInput = document.getElementById('stego-img-decode-input');
        const imgDecodeUpload = document.getElementById('img-decode-zone');

        const btnEncode = document.getElementById('btn-img-encode');
        const btnDecode = document.getElementById('btn-img-decode');

        // Yükleme Alanı Tıklama Tetikleyicileri
        imgUpload?.addEventListener('click', () => imgInput.click());
        imgDecodeUpload?.addEventListener('click', () => imgDecodeInput.click());

        // Görsel Seçme İşlemi (Encode)
        imgInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                sourceImg.src = event.target.result;
                sourceImg.onload = () => {
                    this.sourceImage = sourceImg;
                    imgDims.textContent = `${sourceImg.naturalWidth} x ${sourceImg.naturalHeight} px`;
                    imgPreviewWrap.classList.remove('hidden');
                    imgUpload.style.borderColor = 'var(--cyan)';
                    app.log(`Kaynak görsel yüklendi: ${file.name}`, 'info');
                    this.initLens();
                };
            };
            reader.readAsDataURL(file);
        });

        // Görsel Seçme İşlemi (Decode)
        imgDecodeInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    this.encodedImage = img;
                    imgDecodeUpload.style.borderColor = 'var(--green)';
                    app.log(`Çözülecek görsel yüklendi: ${file.name}`, 'info');
                };
            };
            reader.readAsDataURL(file);
        });

        // Veri Gizleme Tetikleyici
        btnEncode?.addEventListener('click', () => this.imageEncode());

        // Veri Çözme Tetikleyici
        btnDecode?.addEventListener('click', () => this.imageDecode());
    },

    // Metni Binary (İkilik) Diziye Çevirme
    textToBin(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join('');
    },

    // Binary Diziyi Metne Çevirme
    binToText(bin) {
        let text = '';
        for (let i = 0; i < bin.length; i += 8) {
            const byte = bin.substr(i, 8);
            if (byte.length < 8) break;
            const charCode = parseInt(byte, 2);
            if (charCode === 0) break; // Null Sonlandırıcı
            text += String.fromCharCode(charCode);
        }
        return text;
    },

    imageEncode() {
        if (!this.sourceImage) {
            app.log('Stego: Encode için görsel yüklenmedi!', 'error');
            return;
        }

        let message = document.getElementById('img-secret-msg').value;
        const key = document.getElementById('img-enc-key').value;

        if (!message) {
            app.log('Stego: Şifrelenecek mesaj boş olamaz!', 'error');
            return;
        }

        // Anahtar varsa AES ile şifrele
        if (key) {
            try {
                message = 'ENC:' + CryptoJS.AES.encrypt(message, key).toString();
                app.log('Stego: Mesaj piksele gömülmeden önce AES-256 ile şifrelendi.', 'info');
            } catch (err) {
                app.log('Stego: AES şifreleme başarısız!', 'error');
                return;
            }
        }

        // Mesaj sonuna Null karakteri ekle (kod çözerken durma noktamız)
        const binMsg = this.textToBin(message + '\0');

        // Geçici Canvas oluştur
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.sourceImage.naturalWidth;
        canvas.height = this.sourceImage.naturalHeight;
        ctx.drawImage(this.sourceImage, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;

        // Kapasite Kontrolü (R, G, B kanalları kullanılacak)
        const maxCapacity = (pixels.length * 3) / 4;
        if (binMsg.length > maxCapacity) {
            app.log('Stego: Mesaj bu görsel için çok büyük!', 'error');
            return;
        }

        let msgBitIdx = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (msgBitIdx >= binMsg.length) break;

            // R Kanalı LSB
            pixels[i] = (pixels[i] & 0xFE) | parseInt(binMsg[msgBitIdx++]);
            if (msgBitIdx >= binMsg.length) break;

            // G Kanalı LSB
            pixels[i+1] = (pixels[i+1] & 0xFE) | parseInt(binMsg[msgBitIdx++]);
            if (msgBitIdx >= binMsg.length) break;

            // B Kanalı LSB
            pixels[i+2] = (pixels[i+2] & 0xFE) | parseInt(binMsg[msgBitIdx++]);

            // Alpha kanalı (pixels[i+3]) şeffaflık bozulmasın diye atlanır.
        }

        ctx.putImageData(imgData, 0, 0);

        // Görseli İndir
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'shadow_encoded.png';
        link.href = dataURL;
        link.click();

        app.log('Stego: Mesaj görsele gizlendi ve indirme başlatıldı.', 'ok');

        // ----- ÖNİZLEME: encode çıktısını sayfaya göm -----
        let previewWrap = document.getElementById('encode-result-preview');
        if (!previewWrap) {
            previewWrap = document.createElement('div');
            previewWrap.id = 'encode-result-preview';
            previewWrap.style.cssText = 'margin-top:0.75rem; text-align:center;';
            const btnEncode = document.getElementById('btn-img-encode');
            btnEncode?.parentNode?.insertBefore(previewWrap, btnEncode.nextSibling);
        }
        previewWrap.innerHTML = `
            <p class="text-green mono-text" style="margin-bottom:0.4rem;font-size:0.82rem;">
                <i class="fa-solid fa-check-circle"></i> Şifreli Görsel Önizlemesi
            </p>
            <img src="${dataURL}" alt="Encode edilmiş görsel" style="max-width:100%;border:1px solid var(--cyan);border-radius:6px;">
            <p class="text-muted" style="font-size:0.78rem;margin-top:0.3rem;">shadow_encoded.png indirildi.</p>
        `;

        // Isıl karşılaştırma için şifreli görseli kaydet
        const encImg = new Image();
        encImg.src = dataURL;
        encImg.onload = () => {
            this.encodedImage = encImg;
            this.initLens();
        };
    },

    imageDecode() {
        if (!this.encodedImage) {
            app.log('Stego: Çözülecek görsel yüklenmedi!', 'error');
            return;
        }

        const key = document.getElementById('img-dec-key').value;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.encodedImage.naturalWidth;
        canvas.height = this.encodedImage.naturalHeight;
        ctx.drawImage(this.encodedImage, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imgData.data;

        let binMsg = '';
        for (let i = 0; i < pixels.length; i += 4) {
            binMsg += (pixels[i] & 1).toString();
            binMsg += (pixels[i+1] & 1).toString();
            binMsg += (pixels[i+2] & 1).toString();
        }

        let decoded = this.binToText(binMsg);

        if (!decoded) {
            app.log('Stego: Görselde gizli veri bulunamadı.', 'error');
            return;
        }

        // Şifrelenmiş veri kontrolü
        if (decoded.startsWith('ENC:')) {
            const cipherText = decoded.substring(4);
            if (!key) {
                app.log('Stego: Veri AES-256 ile şifreli! Anahtar girmeniz gerekiyor.', 'warn');
                document.getElementById('img-decoded-text').textContent = '[ŞİFRELİ VERİ]\nLütfen bu veriyi çözmek için şifre çözme anahtarını girin ve tekrar deneyin.';
                document.getElementById('img-decode-result').classList.remove('hidden');
                return;
            }
            try {
                const bytes = CryptoJS.AES.decrypt(cipherText, key);
                const originalText = bytes.toString(CryptoJS.enc.Utf8);
                if (!originalText) throw new Error('Decryption empty');
                decoded = originalText;
                app.log('Stego: AES şifreli mesaj başarıyla çözüldü.', 'ok');
            } catch (err) {
                app.log('Stego: Şifre çözme başarısız! Anahtar yanlış olabilir.', 'error');
                document.getElementById('img-decoded-text').textContent = '[HATA]\nGeçersiz şifre çözme anahtarı. Veri çözülemedi.';
                document.getElementById('img-decode-result').classList.remove('hidden');
                return;
            }
        }

        // Sonucu Ekrana Bas
        document.getElementById('img-decoded-text').textContent = decoded;
        document.getElementById('img-decode-result').classList.remove('hidden');
        app.log(`Stego: Mesaj çözüldü → "${decoded.substring(0, 30)}${decoded.length > 30 ? '...' : ''}"`, 'ok');
    },

    /* ==========================================
       2. ISIL FARK MERCEĞİ (THERMAL DIFF LENS)
    ========================================== */
    initLens() {
        const card = document.getElementById('thermal-lens-card');
        const canvas = document.getElementById('lens-canvas');
        const handle = document.getElementById('lens-handle');
        const btnToggle = document.getElementById('btn-diff-toggle');

        if (!canvas) return;

        // Kaynak görsel yoksa bilgi mesajı göster
        if (!this.sourceImage) {
            if (card) {
                card.classList.remove('hidden');
                const wrap = card.querySelector('.lens-wrapper');
                if (wrap) wrap.innerHTML = '<p class="text-muted mono-text" style="padding:1rem;"><i class="fa-solid fa-triangle-exclamation text-warn"></i> Karşılaştırma için Encode sekmesinde bir kaynak görsel yüklemeniz gerekiyor.</p>';
            }
            return;
        }

        if (!this.encodedImage) {
            // Sadece kaynak görsel var — encode bekleniyor
            if (card) card.classList.remove('hidden');
            return;
        }

        // Mercek panelini görünür yap
        card.classList.remove('hidden');

        // Boyutlandırma
        const aspect = this.sourceImage.naturalWidth / this.sourceImage.naturalHeight;
        canvas.width = 620;
        canvas.height = 620 / aspect;

        const updateDraw = () => {
            const ctx = canvas.getContext('2d');
            const w = canvas.width;
            const h = canvas.height;
            const splitX = w * this.lensX;

            ctx.clearRect(0, 0, w, h);

            // Geçici canvaslar ile pikselleri eşleştir
            const origCanvas = document.createElement('canvas');
            origCanvas.width = w;
            origCanvas.height = h;
            origCanvas.getContext('2d').drawImage(this.sourceImage, 0, 0, w, h);
            const origData = origCanvas.getContext('2d').getImageData(0, 0, w, h);

            const encCanvas = document.createElement('canvas');
            encCanvas.width = w;
            encCanvas.height = h;
            encCanvas.getContext('2d').drawImage(this.encodedImage, 0, 0, w, h);
            const encData = encCanvas.getContext('2d').getImageData(0, 0, w, h);

            // Solda şifreli görseli çiz
            ctx.drawImage(this.encodedImage, 0, 0, w, h);

            // Sağda piksel fark haritasını çiz
            const diffData = ctx.createImageData(w, h);
            let diffCount = 0;

            for (let i = 0; i < origData.data.length; i += 4) {
                const diffR = Math.abs(origData.data[i] - encData.data[i]);
                const diffG = Math.abs(origData.data[i+1] - encData.data[i+1]);
                const diffB = Math.abs(origData.data[i+2] - encData.data[i+2]);
                const isDiff = (diffR > 0 || diffG > 0 || diffB > 0);

                if (isDiff) {
                    diffCount++;
                    if (this.lensMode === 'thermal') {
                        // Neon Turuncu/Kırmızı siber renk
                        diffData.data[i] = 255;
                        diffData.data[i+1] = 60;
                        diffData.data[i+2] = 0;
                        diffData.data[i+3] = 255;
                    } else {
                        // Siyah-Beyaz fark modu
                        diffData.data[i] = 255;
                        diffData.data[i+1] = 255;
                        diffData.data[i+2] = 255;
                        diffData.data[i+3] = 255;
                    }
                } else {
                    // Benzer kısımlar koyu siber karbon
                    diffData.data[i] = 8;
                    diffData.data[i+1] = 10;
                    diffData.data[i+2] = 15;
                    diffData.data[i+3] = 255;
                }
            }

            // Arayüze fark adedini yazdır
            const diffInfo = document.getElementById('diff-pixel-info');
            if (diffInfo) diffInfo.textContent = `Farklı piksel sayısı: ${diffCount}`;

            // Kırpılmış çizim
            const diffTempCanvas = document.createElement('canvas');
            diffTempCanvas.width = w;
            diffTempCanvas.height = h;
            diffTempCanvas.getContext('2d').putImageData(diffData, 0, 0);

            ctx.save();
            ctx.beginPath();
            ctx.rect(splitX, 0, w - splitX, h);
            ctx.clip();
            ctx.drawImage(diffTempCanvas, 0, 0);
            ctx.restore();

            // Kaydırıcı Çizgisi
            ctx.beginPath();
            ctx.moveTo(splitX, 0);
            ctx.lineTo(splitX, h);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        // Fare ve Dokunmatik Sürükleme Olayları
        let activeDrag = false;
        const wrapper = document.querySelector('.lens-wrapper');

        const onMove = (clientX) => {
            const rect = wrapper.getBoundingClientRect();
            let x = (clientX - rect.left) / rect.width;
            x = Math.max(0, Math.min(1, x));
            this.lensX = x;
            handle.style.left = `${x * 100}%`;
            updateDraw();
        };

        handle.addEventListener('mousedown', () => activeDrag = true);
        window.addEventListener('mouseup', () => activeDrag = false);
        window.addEventListener('mousemove', (e) => {
            if (activeDrag) onMove(e.clientX);
        });

        // Mobil Dokunmatik Desteği
        handle.addEventListener('touchstart', () => activeDrag = true);
        window.addEventListener('touchend', () => activeDrag = false);
        window.addEventListener('touchmove', (e) => {
            if (activeDrag && e.touches[0]) onMove(e.touches[0].clientX);
        });

        // Isıl mod değiştirme butonu
        if (btnToggle) {
            btnToggle.onclick = () => {
                this.lensMode = this.lensMode === 'thermal' ? 'bw' : 'thermal';
                updateDraw();
            };
        }

        // İlk hizalama
        handle.style.left = '50%';
        this.lensX = 0.5;
        updateDraw();
    },

    refreshLens() {
        this.initLens();
    },


    /* ==========================================
       3. SES STEGANOGRAFISI (WAV LSB)
    ========================================== */
    initAudioStego() {
        const audioInput = document.getElementById('stego-audio-input');
        const audioUpload = document.getElementById('audio-upload-zone');
        const audioPlayerWrap = document.getElementById('audio-player-wrap');
        const sourceAudio = document.getElementById('source-audio');
        const audioFileName = document.getElementById('audio-file-name');

        const audioDecInput = document.getElementById('stego-audio-decode-input');
        const audioDecUpload = document.getElementById('audio-decode-zone');

        const btnEncode = document.getElementById('btn-audio-encode');
        const btnDecode = document.getElementById('btn-audio-decode');

        // Yükleme tetiklemeleri
        audioUpload?.addEventListener('click', () => audioInput.click());
        audioDecUpload?.addEventListener('click', () => audioDecInput.click());

        // Ses Yükleme (Encode)
        audioInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            audioFileName.textContent = file.name;
            audioPlayerWrap.classList.remove('hidden');
            audioUpload.style.borderColor = 'var(--purple)';

            const reader = new FileReader();
            reader.onload = (event) => {
                this.audioBuffer = event.target.result;
                sourceAudio.src = URL.createObjectURL(new Blob([this.audioBuffer], { type: 'audio/wav' }));
                app.log(`Ses dosyası yüklendi: ${file.name}`, 'info');
            };
            reader.readAsArrayBuffer(file);
        });

        // Ses Yükleme (Decode)
        audioDecInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            audioDecUpload.style.borderColor = 'var(--green)';

            const reader = new FileReader();
            reader.onload = (event) => {
                this.decodedAudioBuffer = event.target.result;
                app.log(`Çözülecek ses dosyası yüklendi: ${file.name}`, 'info');
            };
            reader.readAsArrayBuffer(file);
        });

        // Oynatma esnasında spektrogramı tetikle
        sourceAudio?.addEventListener('play', () => {
            this.startSpectrogram();
        });

        sourceAudio?.addEventListener('pause', () => {
            this.stopSpectrogram();
        });

        sourceAudio?.addEventListener('ended', () => {
            this.stopSpectrogram();
        });

        btnEncode?.addEventListener('click', () => this.audioEncode());
        btnDecode?.addEventListener('click', () => this.audioDecode());
    },

    audioEncode() {
        if (!this.audioBuffer) {
            app.log('Stego: Ses dosyası yüklenmedi!', 'error');
            return;
        }

        let message = document.getElementById('audio-secret-msg').value;
        const key = document.getElementById('audio-enc-key').value;

        if (!message) {
            app.log('Stego: Şifrelenecek ses mesajı boş olamaz!', 'error');
            return;
        }

        if (key) {
            try {
                message = 'ENC:' + CryptoJS.AES.encrypt(message, key).toString();
                app.log('Stego: Ses mesajı gömülmeden önce AES-256 ile şifrelendi.', 'info');
            } catch (err) {
                app.log('Stego: AES şifreleme başarısız!', 'error');
                return;
            }
        }

        const binMsg = this.textToBin(message + '\0');
        const headerOffset = 44; // Standart WAV Header boyutu

        const inputBytes = new Uint8Array(this.audioBuffer);
        
        // Kapasite Kontrolü
        if (binMsg.length > (inputBytes.length - headerOffset)) {
            app.log('Stego: Mesaj bu ses dosyası için çok büyük!', 'error');
            return;
        }

        // Yeni array buffer oluştur ve orijinali kopyala
        const outputBytes = new Uint8Array(this.audioBuffer.byteLength);
        outputBytes.set(inputBytes);

        // LSB encoding işlemini sadece veri kısmında (index 44'ten sonra) uygula
        for (let i = 0; i < binMsg.length; i++) {
            const byteIdx = headerOffset + i;
            outputBytes[byteIdx] = (outputBytes[byteIdx] & 0xFE) | parseInt(binMsg[i]);
        }

        // Ses dosyasını indir
        const blob = new Blob([outputBytes.buffer], { type: 'audio/wav' });
        const link = document.createElement('a');
        link.download = 'shadow_audio_encoded.wav';
        link.href = URL.createObjectURL(blob);
        link.click();

        app.log('Stego: Mesaj ses dosyasına gömüldü ve indirme başlatıldı.', 'ok');
    },

    audioDecode() {
        if (!this.decodedAudioBuffer) {
            app.log('Stego: Çözülecek ses dosyası yüklenmedi!', 'error');
            return;
        }

        const key = document.getElementById('audio-dec-key').value;
        const headerOffset = 44;
        const bytes = new Uint8Array(this.decodedAudioBuffer);

        let binMsg = '';
        // Kapasite limiti kadar bit oku (WAV boyutu kadar)
        for (let i = headerOffset; i < bytes.length; i++) {
            binMsg += (bytes[i] & 1).toString();
        }

        let decoded = this.binToText(binMsg);

        if (!decoded) {
            app.log('Stego: Ses dosyasında gizli veri bulunamadı.', 'error');
            return;
        }

        if (decoded.startsWith('ENC:')) {
            const cipherText = decoded.substring(4);
            if (!key) {
                app.log('Stego: Ses verisi AES şifreli! Anahtar gerekli.', 'warn');
                document.getElementById('audio-decoded-text').textContent = '[ŞİFRELİ VERİ]\nLütfen bu veriyi çözmek için şifre çözme anahtarını girin ve tekrar deneyin.';
                document.getElementById('audio-decode-result').classList.remove('hidden');
                return;
            }
            try {
                const bytesDec = CryptoJS.AES.decrypt(cipherText, key);
                const originalText = bytesDec.toString(CryptoJS.enc.Utf8);
                if (!originalText) throw new Error('Audio decryption empty');
                decoded = originalText;
                app.log('Stego: Ses içindeki AES şifreli veri başarıyla çözüldü.', 'ok');
            } catch (err) {
                app.log('Stego: Şifre çözme başarısız! Anahtar yanlış olabilir.', 'error');
                document.getElementById('audio-decoded-text').textContent = '[HATA]\nGeçersiz şifre çözme anahtarı. Veri çözülemedi.';
                document.getElementById('audio-decode-result').classList.remove('hidden');
                return;
            }
        }

        document.getElementById('audio-decoded-text').textContent = decoded;
        document.getElementById('audio-decode-result').classList.remove('hidden');
        app.log(`Stego: Ses dosyasındaki mesaj çözüldü → "${decoded.substring(0, 30)}${decoded.length > 30 ? '...' : ''}"`, 'ok');
    },

    /* ==========================================
       4. SPEKTROGRAM VİZÖRÜ (REAL-TIME SPECTROGRAM)
    ========================================== */
    startSpectrogram() {
        if (this.isSpectrogramRunning) return;

        const canvas = document.getElementById('spectrogram-canvas');
        const audioElement = document.getElementById('source-audio');

        if (!canvas || !audioElement) return;

        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Web Audio API Altyapısını Kur
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 512;
        }

        // AudioContext kapatıldıysa yenisini oluştur
        if (this.audioCtx.state === 'closed') {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 512;
            this.sourceNode = null; // bağlantıyı sıfırla
        }

        // sourceNode daha önce oluşturulmadıysa bağla (InvalidStateError önlemi)
        if (!this.sourceNode) {
            this.sourceNode = this.audioCtx.createMediaElementSource(audioElement);
            this.sourceNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        }

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        this.isSpectrogramRunning = true;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Kaydırma (Rolling Spectrogram) Mantığı
        const render = () => {
            if (!this.isSpectrogramRunning) return;

            this.animationId = requestAnimationFrame(render);
            this.analyser.getByteFrequencyData(dataArray);

            // 1. Mevcut resmi 2px sola kaydır
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(tempCanvas, -2, 0);

            // 2. En sağ köşeye (w-2 ile w arası) yeni kolon piksellerini yerleştir
            const sliceWidth = 2;
            const barHeight = h / bufferLength;

            for (let i = 0; i < bufferLength; i++) {
                const value = dataArray[i]; // 0 - 255 arası ses gücü
                const percent = value / 255;
                const y = h - (i * barHeight);

                // Siber Mor/Cyan Renk Geçiş Haritası
                let r = 0, g = 0, b = 0;
                if (percent > 0) {
                    // Düşük seslerde mor/pembe, yüksek seslerde parlak cyan/beyaz
                    r = Math.floor(189 * percent);
                    g = Math.floor(240 * percent);
                    b = Math.floor(255);
                }

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(w - sliceWidth, y, sliceWidth, barHeight);
            }
        };

        render();
        app.log('Stego: Spektrogram taraması başlatıldı.', 'info');
    },

    stopSpectrogram() {
        this.isSpectrogramRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        app.log('Stego: Spektrogram taraması durduruldu.', 'info');
    }
};

// Modülü Başlat
window.addEventListener('DOMContentLoaded', () => {
    stego.init();
});
