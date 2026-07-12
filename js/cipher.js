/* ============================================
   SHADOW PROTOCOL — CIPHER.JS
   Şifreleme Motorları
   İçerik: Caesar (dönen çark), Vigenère (dinamik
           matris tablosu), XOR (binary akış paneli)
   ============================================ */

const cipher = {

    ALPHA: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /* ------------------------------------------
       BAŞLATICI
    ------------------------------------------ */
    init() {
        this.initCaesar();
        this.initVigenere();
        this.initXOR();
        // Vigenère matrisini hemen oluştur — sekmeye ilk geçişte boş görünmemesi için
        this.buildMatrix();
    },

    /* ==========================================
       1. CAESAR ŞİFRELEME
       Görsel: İç içe geçmiş dönen alfabe çarkları
    ========================================== */
    initCaesar() {
        const shiftRange = document.getElementById('caesar-shift');
        const shiftDisp  = document.getElementById('caesar-shift-display');
        const btnEnc     = document.getElementById('btn-caesar-enc');
        const btnDec     = document.getElementById('btn-caesar-dec');

        if (!shiftRange) return;

        // Çark harflerini oluştur
        this._buildWheelLetters('caesar-wheel-outer', 108);
        this._buildWheelLetters('caesar-wheel-inner', 68);

        // Slider değiştikçe çarkı döndür ve mapping göster
        const onShiftChange = () => {
            const shift = parseInt(shiftRange.value);
            shiftDisp.textContent = shift;
            this.updateWheel(shift);
        };

        shiftRange.addEventListener('input', onShiftChange);
        onShiftChange(); // ilk çizim

        // Şifrele
        btnEnc?.addEventListener('click', () => {
            const text  = document.getElementById('caesar-input').value;
            const shift = parseInt(shiftRange.value);
            if (!text) return app.log('Caesar: Metin alanı boş!', 'error');

            document.getElementById('caesar-input').value = this._caesarRun(text, shift);
            app.log(`Caesar: Metin ${shift} adım kaydırılarak şifrelendi.`, 'ok');
        });

        // Çöz
        btnDec?.addEventListener('click', () => {
            const text  = document.getElementById('caesar-input').value;
            const shift = parseInt(shiftRange.value);
            if (!text) return app.log('Caesar: Metin alanı boş!', 'error');

            document.getElementById('caesar-input').value = this._caesarRun(text, 26 - shift);
            app.log(`Caesar: Metin ${shift} adım geri kaydırılarak çözüldü.`, 'ok');
        });
    },

    /**
     * Alfabe harflerini daire üzerine yerleştirir
     */
    _buildWheelLetters(id, radius) {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '';

        for (let i = 0; i < 26; i++) {
            const angle = (i / 26) * 2 * Math.PI - Math.PI / 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            const span = document.createElement('span');
            span.className    = 'wheel-letter';
            span.textContent  = this.ALPHA[i];
            span.style.cssText = `
                transform: translate(calc(-50% + ${x}px), calc(-50% + ${y}px))
                           rotate(${(i / 26) * 360}deg);
                color: ${id.includes('outer') ? 'var(--cyan)' : 'var(--purple)'};
                font-size: ${id.includes('outer') ? '0.75rem' : '0.68rem'};
            `;
            el.appendChild(span);
        }
    },

    /**
     * İç çarkı shift değerine göre döndürür ve mapping metnini günceller
     */
    updateWheel(shift) {
        shift = shift ?? parseInt(document.getElementById('caesar-shift')?.value ?? 3);
        const inner = document.getElementById('caesar-wheel-inner');
        if (inner) {
            const deg = -(shift / 26) * 360;
            // translate ve rotate birlikte uygula
            inner.style.transform = `translate(-50%, -50%) rotate(${deg}deg)`;
        }

        // Mapping önizleme: A→X, B→Y, C→Z
        const mappingEl = document.getElementById('caesar-mapping');
        if (mappingEl) {
            const sample = ['A', 'B', 'C'].map(ch => {
                const to = this.ALPHA[(this.ALPHA.indexOf(ch) + shift) % 26];
                return `${ch} ➔ ${to}`;
            }).join('   ');
            mappingEl.textContent = sample;
        }
    },

    /**
     * Caesar şifreleme/çözme çekirdeği
     */
    _caesarRun(text, shift) {
        return text.split('').map(ch => {
            const upper = ch.toUpperCase();
            const idx   = this.ALPHA.indexOf(upper);
            if (idx === -1) return ch; // harf değilse olduğu gibi bırak
            const newChar = this.ALPHA[(idx + shift) % 26];
            return ch === upper ? newChar : newChar.toLowerCase();
        }).join('');
    },

    /* ==========================================
       2. VİGENÈRE ŞİFRELEME
       Görsel: Dinamik 26×26 matris tablosu,
               eşleşen hücre ve satırlar vurgulanır
    ========================================== */
    initVigenere() {
        const btnEnc = document.getElementById('btn-vigenere-enc');
        const btnDec = document.getElementById('btn-vigenere-dec');

        btnEnc?.addEventListener('click', () => {
            const text = document.getElementById('vigenere-input').value;
            const key  = document.getElementById('vigenere-key').value.trim().toUpperCase();
            if (!text || !key) return app.log('Vigenère: Metin veya anahtar boş!', 'error');

            const result = this._vigenereRun(text, key, true);
            document.getElementById('vigenere-input').value = result;
            app.log(`Vigenère: "${key}" anahtarıyla şifrelendi.`, 'ok');
        });

        btnDec?.addEventListener('click', () => {
            const text = document.getElementById('vigenere-input').value;
            const key  = document.getElementById('vigenere-key').value.trim().toUpperCase();
            if (!text || !key) return app.log('Vigenère: Metin veya anahtar boş!', 'error');

            const result = this._vigenereRun(text, key, false);
            document.getElementById('vigenere-input').value = result;
            app.log(`Vigenère: "${key}" anahtarıyla çözüldü.`, 'ok');
        });
    },

    /**
     * Vigenère 26×26 matris tablosunu oluşturur (bir kez)
     */
    buildMatrix() {
        const wrap = document.getElementById('vigenere-matrix');
        if (!wrap || wrap.querySelector('table')) return; // zaten oluşturulduysa tekrar oluşturma

        const table = document.createElement('table');

        // Başlık satırı
        const headRow = document.createElement('tr');
        headRow.appendChild(this._th(''));
        for (let c = 0; c < 26; c++) headRow.appendChild(this._th(this.ALPHA[c]));
        table.appendChild(headRow);

        // Gövde satırları
        for (let r = 0; r < 26; r++) {
            const tr = document.createElement('tr');
            tr.id = `vig-r-${this.ALPHA[r]}`;
            tr.appendChild(this._th(this.ALPHA[r]));

            for (let c = 0; c < 26; c++) {
                const td = document.createElement('td');
                td.id          = `vig-c-${this.ALPHA[r]}-${this.ALPHA[c]}`;
                td.textContent = this.ALPHA[(r + c) % 26];
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        wrap.appendChild(table);
    },

    _th(text) {
        const th = document.createElement('th');
        th.textContent = text;
        return th;
    },

    /**
     * Vigenère şifreleme/çözme çekirdeği + matris vurgulama
     */
    _vigenereRun(text, key, isEncrypt) {
        // Önceki vurgulamaları temizle
        document.querySelectorAll('.vig-highlight-row, .vig-highlight-cell').forEach(el => {
            el.classList.remove('vig-highlight-row', 'vig-highlight-cell');
        });

        const cleanKey = key.replace(/[^A-Z]/g, '');
        if (!cleanKey) return text;

        let keyIdx = 0;
        const steps = [];
        const result = [];

        for (const ch of text) {
            const upper   = ch.toUpperCase();
            const charIdx = this.ALPHA.indexOf(upper);

            if (charIdx === -1) { result.push(ch); continue; }

            const keyChar    = cleanKey[keyIdx % cleanKey.length];
            const keyCharIdx = this.ALPHA.indexOf(keyChar);

            const newIdx = isEncrypt
                ? (charIdx + keyCharIdx) % 26
                : (charIdx - keyCharIdx + 26) % 26;

            const out = this.ALPHA[newIdx];
            result.push(ch === upper ? out : out.toLowerCase());

            // İlk 4 adımı vurgula
            if (steps.length < 4) {
                steps.push(`'${upper}' + '${keyChar}' ➔ '${out}'`);

                const rowEl  = document.getElementById(`vig-r-${keyChar}`);
                const cellEl = document.getElementById(`vig-c-${keyChar}-${upper}`);
                rowEl?.classList.add('vig-highlight-row');
                cellEl?.classList.add('vig-highlight-cell');
            }

            keyIdx++;
        }

        // Adım bilgisi göster
        const stepInfo = document.getElementById('vigenere-step-info');
        if (stepInfo) stepInfo.innerHTML = steps.join(' &nbsp;|&nbsp; ');

        return result.join('');
    },

    /* ==========================================
       3. XOR ŞİFRELEME
       Görsel: Bit düzeyinde binary operasyon akış paneli
    ========================================== */
    initXOR() {
        const btn = document.getElementById('btn-xor-process');
        btn?.addEventListener('click', () => this._xorProcess());
    },

    _xorProcess() {
        const text = document.getElementById('xor-input').value;
        const key  = document.getElementById('xor-key').value;

        if (!text) return app.log('XOR: Metin alanı boş!', 'error');
        if (!key)  return app.log('XOR: Anahtar boş!', 'error');

        let output   = '';
        const rows   = [];

        for (let i = 0; i < text.length; i++) {
            const ch      = text[i];
            const keyChar = key[i % key.length];
            const chCode  = ch.charCodeAt(0);
            const keyCode = keyChar.charCodeAt(0);
            const xorCode = chCode ^ keyCode;

            output += String.fromCharCode(xorCode);

            if (rows.length < 12) { // panelde en fazla 12 satır göster
                rows.push({
                    ch, keyChar, chCode, keyCode, xorCode,
                    chBin:  chCode.toString(2).padStart(8, '0'),
                    kBin:   keyCode.toString(2).padStart(8, '0'),
                    outBin: xorCode.toString(2).padStart(8, '0'),
                    outCh:  String.fromCharCode(xorCode)
                });
            }
        }

        document.getElementById('xor-input').value = output;

        // Akış panelini doldur
        const body = document.getElementById('xor-flow-body');
        if (!body) return;

        body.innerHTML = '';

        rows.forEach(r => {
            // Özet satır
            const row = document.createElement('div');
            row.className = 'xor-flow-row';
            row.innerHTML = `
                <span class="text-cyan">'${r.ch}' ⊕ '${r.keyChar}'</span>
                <span>${r.chCode} ⊕ ${r.keyCode} = <strong class="text-green">${r.xorCode}</strong></span>
                <span class="text-green">${r.outBin}</span>
            `;
            body.appendChild(row);

            // Detay bloğu
            const detail = document.createElement('div');
            detail.className = 'xor-flow-detail';
            detail.innerHTML =
                `Char: &nbsp;<span class="text-cyan">${r.chBin}</span> (${r.chCode})<br>` +
                `Key: &nbsp; <span class="text-purple">${r.kBin}</span> (${r.keyCode})<br>` +
                `XOR: &nbsp; <span class="text-green">${r.outBin}</span> (${r.xorCode}) → '${r.outCh}'`;
            body.appendChild(detail);
        });

        if (text.length > 12) {
            const more = document.createElement('p');
            more.className   = 'text-muted text-center';
            more.style.marginTop = '0.5rem';
            more.textContent = `...ve ${text.length - 12} karakter daha işlendi.`;
            body.appendChild(more);
        }

        app.log(`XOR: ${text.length} karakter işlendi.`, 'ok');
    }
};

/* ------------------------------------------
   CIPHER MODÜLÜNÜ BAŞLAT
------------------------------------------ */
window.addEventListener('DOMContentLoaded', () => {
    cipher.init();
});
