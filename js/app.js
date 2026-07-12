/* ============================================
   SHADOW PROTOCOL — APP.JS
   Uygulama Kontrolcüsü
   Görevler: Sekme yönetimi, terminal log sistemi,
             sistem saati, dashboard gauge animasyonları
   ============================================ */

const app = {

    // Aktif sekme takibi
    activeTab: 'control-deck',

    /* ------------------------------------------
       BAŞLATICI
    ------------------------------------------ */
    init() {
        this.initClock();
        this.initTabNavigation();
        this.initSubTabNavigation();
        this.initTerminalLog();
        this.initDashboardGauges();

        // Açılış log mesajları
        this.log('SHADOW_PROTOCOL v1.0 başlatılıyor...', 'info');
        setTimeout(() => this.log('Yerel düğümlerle bağlantı kuruluyor...', 'info'), 700);
        setTimeout(() => this.log('El sıkışma güvenli. Web Audio API hazır.', 'ok'), 1400);
        setTimeout(() => this.log('Sistem hazır. Operasyonel yetki: SEVİYE 4', 'ok'), 2100);
        setTimeout(() => this.log('Bekleyen görev: "The Leak" — GÖREV ODASI\'na git.', 'warn'), 2800);
    },

    /* ------------------------------------------
       SİSTEM SAATİ
    ------------------------------------------ */
    initClock() {
        const el = document.getElementById('system-time');
        if (!el) return;

        const tick = () => {
            const now = new Date();
            el.textContent = now.toTimeString().slice(0, 8);
        };

        tick();
        setInterval(tick, 1000);
    },

    /* ------------------------------------------
       ANA SEKME YÖNETİMİ (SPA)
    ------------------------------------------ */
    initTabNavigation() {
        const buttons = document.querySelectorAll('.cyber-nav .nav-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });
    },

    switchTab(tabId) {
        if (this.activeTab === tabId) return;

        // Buton durumlarını güncelle
        document.querySelectorAll('.cyber-nav .nav-btn').forEach(btn => {
            const isTarget = btn.dataset.tab === tabId;
            btn.classList.toggle('active', isTarget);
            btn.setAttribute('aria-selected', isTarget);
        });

        // Sekme içeriklerini güncelle
        document.querySelectorAll('.tab-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === tabId);
        });

        this.activeTab = tabId;

        const labels = {
            'control-deck':   'Kontrol Merkezi',
            'stego-lab':      'Stego Lab',
            'cipher-engine':  'Şifre Motoru',
            'mission-control': 'Görev Odası'
        };

        this.log(`Arayüz odağı değiştirildi → ${labels[tabId] || tabId}`, 'info');

        // Stego Lab'a geçişte lens'i yenile
        if (tabId === 'stego-lab') {
            if (typeof stego !== 'undefined') stego.refreshLens();
        }
    },

    /* ------------------------------------------
       ALT SEKME YÖNETİMİ (Stego subtabs & Cipher subtabs)
    ------------------------------------------ */
    initSubTabNavigation() {
        // Stego Lab alt sekmeleri
        this._bindSubtabs(
            '#stego-lab .subtab-btn',
            '#stego-lab .subtab-section',
            (id) => {
                this.log(`Stego Lab → ${id === 'image-stego' ? 'Görsel' : 'Ses'} modülü aktif`, 'info');
                if (id === 'audio-stego' && typeof stego !== 'undefined') {
                    stego.startSpectrogram();
                } else if (typeof stego !== 'undefined') {
                    stego.stopSpectrogram();
                }
            }
        );

        // Cipher Engine alt sekmeleri
        this._bindSubtabs(
            '#cipher-engine .subtab-btn',
            '#cipher-engine .subtab-section',
            (id) => {
                this.log(`Şifre Motoru → ${id.toUpperCase()} modülü aktif`, 'info');
                if (id === 'caesar' && typeof cipher !== 'undefined') {
                    cipher.updateWheel();
                } else if (id === 'vigenere' && typeof cipher !== 'undefined') {
                    cipher.buildMatrix();
                }
            }
        );
    },

    _bindSubtabs(btnSelector, sectionSelector, onSwitch) {
        const buttons  = document.querySelectorAll(btnSelector);
        const sections = document.querySelectorAll(sectionSelector);

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.subtab;

                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                sections.forEach(s => s.classList.toggle('active', s.id === target));

                if (onSwitch) onSwitch(target);
            });
        });
    },

    /* ------------------------------------------
       TERMİNAL LOG SİSTEMİ
    ------------------------------------------ */
    initTerminalLog() {
        this._logEl = document.getElementById('terminal-logs');
    },

    /**
     * @param {string} msg   - Log mesajı
     * @param {'info'|'ok'|'warn'|'error'} type - Log seviyesi
     */
    log(msg, type = 'info') {
        if (!this._logEl) return;

        const time = new Date().toTimeString().slice(0, 8);
        const levelMap = { info: 'INFO', ok: 'OK', warn: 'UYARI', error: 'HATA' };

        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="log-lvl ${type}">${levelMap[type] || 'INFO'}:</span>
            <span>${msg}</span>
        `;

        this._logEl.appendChild(line);

        // Otomatik aşağı kaydır
        this._logEl.scrollTop = this._logEl.scrollHeight;

        // Maksimum 120 log satırı tut (performans)
        const lines = this._logEl.querySelectorAll('.log-line');
        if (lines.length > 120) lines[0].remove();
    },

    /* ------------------------------------------
       DASHBOARD — CPU & RAM GAUGE ANİMASYONLARI
    ------------------------------------------ */
    initDashboardGauges() {
        const cpuCanvas = document.getElementById('cpu-gauge');
        const ramCanvas = document.getElementById('ram-gauge');
        if (!cpuCanvas || !ramCanvas) return;

        // Simüle edilmiş başlangıç değerleri
        this._cpu = 42;
        this._ram = 67;

        this._drawGauge(cpuCanvas, this._cpu, '#00f0ff');
        this._drawGauge(ramCanvas, this._ram, '#bd00ff');

        // Her saniye küçük dalgalanmalar ekle
        setInterval(() => {
            if (this.activeTab !== 'control-deck') return;

            this._cpu = this._clamp(this._cpu + (Math.random() - 0.5) * 9, 8, 96);
            this._ram = this._clamp(this._ram + (Math.random() - 0.5) * 4, 40, 88);

            this._drawGauge(cpuCanvas, this._cpu, '#00f0ff');
            this._drawGauge(ramCanvas, this._ram, '#bd00ff');

            const cpuVal = document.getElementById('cpu-val');
            const ramVal = document.getElementById('ram-val');
            if (cpuVal) cpuVal.textContent = `${Math.round(this._cpu)}%`;
            if (ramVal) ramVal.textContent = `${Math.round(this._ram)}%`;
        }, 1000);
    },

    /**
     * Halka şeklinde gauge çizer
     * @param {HTMLCanvasElement} canvas
     * @param {number} value - 0 ile 100 arasında
     * @param {string} color - Neon renk
     */
    _drawGauge(canvas, value, color) {
        const ctx  = canvas.getContext('2d');
        const w    = canvas.width;
        const h    = canvas.height;
        const cx   = w / 2;
        const cy   = h / 2;
        const r    = 48;
        const lw   = 7;

        // Başlangıç ve bitiş açıları (saat 7'den saat 5'e — 270° yay)
        const startAngle = 0.75 * Math.PI;
        const fullSweep  = 1.5 * Math.PI;
        const endAngle   = startAngle + (value / 100) * fullSweep;

        ctx.clearRect(0, 0, w, h);

        // Arka plan yayı (gri iz)
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, startAngle + fullSweep);
        ctx.lineWidth   = lw;
        ctx.strokeStyle = 'rgba(255,255,255,0.07)';
        ctx.lineCap     = 'round';
        ctx.stroke();

        // Aktif yay (neon renkli)
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.lineWidth     = lw;
        ctx.strokeStyle   = color;
        ctx.shadowBlur    = 12;
        ctx.shadowColor   = color;
        ctx.lineCap       = 'round';
        ctx.stroke();

        // Glow sıfırla
        ctx.shadowBlur = 0;

        // İç nokta deseni (dekoratif)
        ctx.beginPath();
        ctx.arc(cx, cy, r - 10, startAngle, startAngle + fullSweep);
        ctx.lineWidth   = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.setLineDash([2, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
    },

    /* ------------------------------------------
       YARDIMCILAR
    ------------------------------------------ */
    _clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
};

/* ------------------------------------------
   UYGULAMA BAŞLAT
------------------------------------------ */
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
