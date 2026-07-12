/* ============================================
   SHADOW PROTOCOL — MISSIONS.JS
   Görev Odası ve Oyunlaştırma Modülü
   İçerik: Programatik WAV/PNG üretimi ve görev kontrolü
   ============================================ */

const missions = {
    currentMission: 1,
    
    // Görev parametreleri
    answers: {
        1: 'AGENT_PASSCODE_777',
        2: '41.1082,29.0284',
        3: 'SHADOW_PROTOCOL'
    },

    /* ------------------------------------------
       BAŞLATICI
    ------------------------------------------ */
    init() {
        this.renderActiveMission();

        const btnSubmit = document.getElementById('btn-submit-mission-answer');
        const btnSubmitAlt = document.getElementById('btn-mission-submit'); // index.html ile uyumlu olması için ikisini de dinliyoruz
        
        const checkAnswer = () => this.validateAnswer();

        btnSubmit?.addEventListener('click', checkAnswer);
        btnSubmitAlt?.addEventListener('click', checkAnswer);

        // Sidebar görev tıklamaları
        document.querySelectorAll('.mission-sidebar .mission-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const missionNum = parseInt(item.dataset.mission);
                if (item.classList.contains('locked')) {
                    app.log(`Görev ${missionNum} kilitli! Önceki görevleri tamamlamalısınız.`, 'error');
                    return;
                }
                this.selectMission(missionNum);
            });
        });
    },

    selectMission(num) {
        this.currentMission = num;
        document.querySelectorAll('.mission-sidebar .mission-list-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.mission) === num);
        });
        this.renderActiveMission();
    },

    renderActiveMission() {
        const titleEl = document.getElementById('active-mission-name');
        const descEl = document.getElementById('active-mission-desc');
        const playground = document.getElementById('mission-playground');
        const inputEl = document.getElementById('mission-answer') || document.getElementById('mission-answer-input');
        const feedbackEl = document.getElementById('mission-feedback');

        if (inputEl) inputEl.value = '';
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'mission-feedback mono-text';
        }

        if (this.currentMission === 1) {
            if (titleEl) titleEl.textContent = 'GÖREV 1: The Leak (Ses Sızıntısı)';
            if (descEl) descEl.textContent = 'Ajan, sızdırılan gizli bir ses dosyasını ele geçirdik. Aşağıdaki "Ses Dosyasını İndir" butonuna basarak dosyayı al. Dosyayı Stego Lab sekmesindeki "Ses Decode" alanına yükleyerek içerisindeki parolayı çöz ve buraya yaz.';
            
            // Programatik WAV üretimi ve arayüze buton ekleme
            playground.innerHTML = `
                <div class="flex-col gap-1 align-center text-center">
                    <p class="text-purple mono-text"><i class="fa-solid fa-file-audio"></i> Sızdırılmış Ses Dosyası Hazır</p>
                    <button class="btn btn-purple btn-sm" id="btn-download-m1">
                        <i class="fa-solid fa-download"></i> intercept_leak.wav İndir
                    </button>
                </div>
            `;

            document.getElementById('btn-download-m1')?.addEventListener('click', () => this.downloadMission1Wav());

        } else if (this.currentMission === 2) {
            if (titleEl) titleEl.textContent = 'GÖREV 2: Thermal Intel (Isıl Harita)';
            if (descEl) descEl.textContent = 'Güzel iş ajan! Parolayı kırarak yeni istihbarata eriştin. Karargahımızın uydu görüntülerinde gizlenmiş kaçış koordinatları bulunuyor. Görseli indir, Stego Lab\'a gidip "Veri Çöz" alanına yükleyerek koordinat bilgisini çıkar ve buraya yaz.';
            
            // Programatik PNG üretimi ve arayüze buton ekleme
            playground.innerHTML = `
                <div class="flex-col gap-1 align-center text-center">
                    <p class="text-cyan mono-text"><i class="fa-solid fa-file-image"></i> Şifreli Harita Görseli Hazır</p>
                    <button class="btn btn-cyan btn-sm" id="btn-download-m2">
                        <i class="fa-solid fa-download"></i> satellite_map.png İndir
                    </button>
                </div>
            `;

            document.getElementById('btn-download-m2')?.addEventListener('click', () => this.downloadMission2Png());

        } else if (this.currentMission === 3) {
            if (titleEl) titleEl.textContent = 'GÖREV 3: Final Key (Son Şifre)';
            if (descEl) descEl.textContent = 'Hedef noktaya ulaştın, ancak sistem veri tabanını açmak için son şifreyi çözmelisin. Elimizdeki şifreli metin "ZOHKVD_WYVAVJVS" olarak görünüyor. Karargahın eski günlüklerinde bunun CAESAR şifresiyle şifrelendiği ve kaydırma adımının (shift) 7 olduğu yazıyor. Şifre Engine sekmesine gidip bu şifreyi kır ve nihai anahtarı buraya gir!';

            playground.innerHTML = `
                <div class="flex-col gap-1 align-center text-center">
                    <p class="text-green mono-text"><i class="fa-solid fa-key"></i> ŞİFRELİ VERİ: "ZOHKVD_WYVAVJVS"</p>
                    <p class="text-muted" style="font-size: 0.82rem;">İpucu: Caesar Şifre Çözücü kullanın (Shift: 7)</p>
                </div>
            `;
        }
    },

    validateAnswer() {
        const inputEl = document.getElementById('mission-answer') || document.getElementById('mission-answer-input');
        const feedbackEl = document.getElementById('mission-feedback');
        if (!inputEl || !feedbackEl) return;

        const val = inputEl.value.trim();
        const correctVal = this.answers[this.currentMission];

        if (val.toUpperCase() === correctVal.toUpperCase()) {
            feedbackEl.textContent = 'DOĞRULAMA BAŞARILI! Sistem kilidi açıldı.';
            feedbackEl.className = 'mission-feedback mono-text text-green';
            app.log(`Görev ${this.currentMission} başarıyla tamamlandı.`, 'ok');

            if (this.currentMission < 3) {
                const nextMission = this.currentMission + 1;
                // Bir sonraki görevin kilidini aç
                const sidebarItem = document.querySelector(`.mission-sidebar .mission-list-item[data-mission="${nextMission}"]`);
                if (sidebarItem) {
                    sidebarItem.classList.remove('locked');
                    const icon = sidebarItem.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-unlock text-cyan';
                }
                
                // 1.5 saniye sonra geçiş yap
                setTimeout(() => {
                    this.selectMission(nextMission);
                }, 1500);
            } else {
                // Tün görevler bittiğinde siber kutlama logları bas
                app.log('--- PROTOKOL TAMAMLANDI ---', 'warn');
                app.log('SİSTEM ERİŞİMİ ONAYLANDI. TÜM DOSYALAR ELE GEÇİRİLDİ.', 'ok');
                app.log('Hoşçakalın Ajan... Sistem sonlandırılıyor.', 'info');
                
                playground = document.getElementById('mission-playground');
                playground.innerHTML = `
                    <div class="flex-col gap-1 align-center text-center" style="animation: pulse 1s infinite alternate;">
                        <h3 class="text-green font-display" style="font-size: 1.5rem;">ACCESS GRANTED</h3>
                        <p class="text-green mono-text">Tebrikler Ajan! Tüm siber görevleri başarıyla tamamladın.</p>
                    </div>
                `;
            }
        } else {
            feedbackEl.textContent = 'YANLIŞ CEVAP. Lütfen şifreleri tekrar kontrol edin.';
            feedbackEl.className = 'mission-feedback mono-text text-red';
            app.log(`Görev ${this.currentMission} başarısız giriş denemesi: "${val}"`, 'error');
        }
    },

    /* ==========================================
       PROGRAMATİK WAV SES ÜRETİMİ (8kHz Mono 8-bit PCM)
    ========================================== */
    downloadMission1Wav() {
        const sampleRate = 8000;
        const duration = 1.2; // saniye
        const numSamples = sampleRate * duration;
        const headerSize = 44;
        const bufferSize = headerSize + numSamples;

        const buffer = new ArrayBuffer(bufferSize);
        const view = new DataView(buffer);

        /* WAV Header Yazma */
        // "RIFF"
        this.writeString(view, 0, 'RIFF');
        // File size - 8
        view.setUint32(4, bufferSize - 8, true);
        // "WAVE"
        this.writeString(view, 8, 'WAVE');
        // "fmt "
        this.writeString(view, 12, 'fmt ');
        // chunk size (16)
        view.setUint32(16, 16, true);
        // sample format (1 = PCM)
        view.setUint16(20, 1, true);
        // channel count (1 = mono)
        view.setUint16(22, 1, true);
        // sample rate
        view.setUint32(24, sampleRate, true);
        // byte rate (sampleRate * blockAlign)
        view.setUint32(28, sampleRate, true);
        // block align (1 channel, 1 byte sample)
        view.setUint16(32, 1, true);
        // bits per sample (8)
        view.setUint16(34, 8, true);
        // "data"
        this.writeString(view, 36, 'data');
        // chunk size (data size)
        view.setUint32(40, numSamples, true);

        /* PCM Verilerini Yazma (Sine Wave) */
        const bytes = new Uint8Array(buffer);
        const hz = 330; // La (A3) frekansı
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const sample = Math.floor(128 + 127 * Math.sin(2 * Math.PI * hz * t));
            bytes[headerSize + i] = sample;
        }

        // Parolayı LSB ile göm
        const secret = this.answers[1] + '\0';
        const binSecret = stego.textToBin(secret);

        for (let i = 0; i < binSecret.length; i++) {
            const byteIdx = headerSize + i;
            bytes[byteIdx] = (bytes[byteIdx] & 0xFE) | parseInt(binSecret[i]);
        }

        // İndirme başlat
        const blob = new Blob([buffer], { type: 'audio/wav' });
        const link = document.createElement('a');
        link.download = 'intercept_leak.wav';
        link.href = URL.createObjectURL(blob);
        link.click();
        
        app.log('Görev 1: intercept_leak.wav dosyası başarıyla üretildi ve indirildi.', 'ok');
    },

    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    },

    /* ==========================================
       PROGRAMATİK PNG GÖRSEL ÜRETİMİ (Target Canvas Grid)
    ========================================== */
    downloadMission2Png() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Siberpunk hedefler / şık arka plan çiz
        ctx.fillStyle = '#060810';
        ctx.fillRect(0, 0, 256, 256);

        // Siber Çember ve Grid Çizimi
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1;
        
        // Dış Kareler
        ctx.strokeRect(10, 10, 236, 236);
        ctx.strokeRect(20, 20, 216, 216);

        // Artı işareti
        ctx.beginPath();
        ctx.moveTo(128, 10); ctx.lineTo(128, 246);
        ctx.moveTo(10, 128); ctx.lineTo(246, 128);
        ctx.stroke();

        // Daire
        ctx.beginPath();
        ctx.arc(128, 128, 60, 0, 2 * Math.PI);
        ctx.stroke();

        // Dekoratif hedef metinleri
        ctx.fillStyle = '#bd00ff';
        ctx.font = '9px Orbitron';
        ctx.fillText('TARGET LOCK: SECURE', 30, 45);
        ctx.fillText('SAT_REF: 4881-A', 150, 220);

        const imgData = ctx.getImageData(0, 0, 256, 256);
        const pixels = imgData.data;

        // Koordinat bilgisini piksel kanallarına göm
        const secret = this.answers[2] + '\0';
        const binSecret = stego.textToBin(secret);

        let msgBitIdx = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (msgBitIdx >= binSecret.length) break;

            pixels[i] = (pixels[i] & 0xFE) | parseInt(binSecret[msgBitIdx++]);
            if (msgBitIdx >= binSecret.length) break;

            pixels[i+1] = (pixels[i+1] & 0xFE) | parseInt(binSecret[msgBitIdx++]);
            if (msgBitIdx >= binSecret.length) break;

            pixels[i+2] = (pixels[i+2] & 0xFE) | parseInt(binSecret[msgBitIdx++]);
        }

        ctx.putImageData(imgData, 0, 0);

        // İndirme başlat
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'satellite_map.png';
        link.href = dataURL;
        link.click();

        app.log('Görev 2: satellite_map.png dosyası siber grafiklerle üretildi ve indirildi.', 'ok');
    }
};

// Modülü Başlat
window.addEventListener('DOMContentLoaded', () => {
    missions.init();
});
