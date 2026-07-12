/* ============================================
   SHADOW PROTOCOL — AI.JS
   Gemini API Entegrasyon Modülü
   İçerik: İstemci taraflı yapay zeka sohbet asistanı
   ============================================ */

const ai = {
    apiKey: '',
    chatHistory: [],

    init() {
        const inputKey = document.getElementById('ai-api-key');
        const btnSave = document.getElementById('btn-save-key');
        const btnSend = document.getElementById('btn-send-ai-msg');
        const inputMsg = document.getElementById('ai-chat-input');

        if (!inputKey) return;

        // API anahtarını yerel depolamadan yükle
        this.apiKey = localStorage.getItem('gemini_api_key') || '';
        if (this.apiKey) {
            inputKey.value = this.apiKey;
            app.log('AI: Yerel Gemini API anahtarı yüklendi.', 'ok');
        }

        // Kaydet butonu tetikleyici
        btnSave?.addEventListener('click', () => {
            const keyVal = inputKey.value.trim();
            if (keyVal) {
                localStorage.setItem('gemini_api_key', keyVal);
                this.apiKey = keyVal;
                app.log('AI: Gemini API anahtarı güvenli şekilde kaydedildi.', 'ok');
                this.appendSystemMessage('Sistem: API anahtarı güncellendi ve kaydedildi.');
            } else {
                localStorage.removeItem('gemini_api_key');
                this.apiKey = '';
                app.log('AI: API anahtarı temizlendi.', 'warn');
                this.appendSystemMessage('Sistem: API anahtarı temizlendi.');
            }
        });

        // Gönderme tetikleyicileri
        btnSend?.addEventListener('click', () => this.sendMessage());
        inputMsg?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    },

    appendSystemMessage(text) {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;

        const div = document.createElement('div');
        div.className = 'log-line';
        div.style.color = 'var(--text-muted)';
        div.textContent = text;
        historyEl.appendChild(div);
        historyEl.scrollTop = historyEl.scrollHeight;
    },

    appendMessage(sender, text, isUser = false) {
        const historyEl = document.getElementById('ai-chat-history');
        if (!historyEl) return;

        const div = document.createElement('div');
        div.className = 'log-line';
        
        const label = document.createElement('span');
        label.className = isUser ? 'text-cyan' : 'text-purple';
        label.textContent = `${sender}: `;

        const body = document.createElement('span');
        body.textContent = text;

        div.appendChild(label);
        div.appendChild(body);
        historyEl.appendChild(div);

        // Otomatik aşağı kaydır
        historyEl.scrollTop = historyEl.scrollHeight;
    },

    async sendMessage() {
        const inputMsg = document.getElementById('ai-chat-input');
        if (!inputMsg) return;

        const text = inputMsg.value.trim();
        if (!text) return;

        if (!this.apiKey) {
            app.log('AI: Önce bir Gemini API anahtarı kaydetmelisiniz!', 'error');
            this.appendSystemMessage('Sistem: Yanıt alabilmek için lütfen yukarıdaki alana geçerli bir Gemini API anahtarı girip kaydedin.');
            return;
        }

        // Kullanıcı mesajını arayüze ekle ve girdiyi sıfırla
        this.appendMessage('AGENT', text, true);
        inputMsg.value = '';

        // Gemini API formatında geçmiş kaydı
        this.chatHistory.push({
            role: 'user',
            parts: [{ text: text }]
        });

        // Düşünme/Yükleniyor animasyonu
        const historyEl = document.getElementById('ai-chat-history');
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'log-line';
        loadingDiv.id = 'ai-loading-indicator';
        loadingDiv.innerHTML = `<span class="text-purple">NODE-1.5:</span> Düşünülüyor... <i class="fa-solid fa-spinner fa-spin"></i>`;
        historyEl.appendChild(loadingDiv);
        historyEl.scrollTop = historyEl.scrollHeight;

        try {
            const systemInstruction = 
                "Sen ShadowProtocol sisteminin siberpunk yapay zeka asistanı NODE-1.5'sin. " +
                "Görevin, ajana steganografi, şifreleme motoru ve görev odasındaki siber görevlerde teknik destek ve ipuçları vermektir. " +
                "Görevlerin çözümleri şunlardır: Görev 1: 'AGENT_PASSCODE_777', Görev 2: '41.1082,29.0284', Görev 3: 'SHADOW_PROTOCOL'. " +
                "Ajan bu çözümleri doğrudan sorduğunda doğrudan vermeyebilirsin ama onlara mantığı açıklayarak ipucu ver. " +
                "Tüm yanıtlarını kısa, siber temaya uygun, teknik ve siberpunk stilinde tut. Türkçe yanıt ver.";

            let response;
            let responseData;
            let success = false;

            // 1. Yol: Önce Güvenli Yerel Sunucu Üzerinden Dene (Proxy)
            try {
                response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: this.chatHistory,
                        systemInstruction: {
                            parts: [{ text: systemInstruction }]
                        }
                    })
                });

                if (response.ok) {
                    responseData = await response.json();
                    success = true;
                    app.log('AI: Yerel sunucu proxy kanalıyla yanıt alındı.', 'ok');
                } else {
                    const errBody = await response.json().catch(() => ({}));
                    app.log(`AI: Yerel sunucu proxy hatası (${response.status}): ${errBody.error?.message || 'İstek başarısız'}. İstemci moduna geçiliyor.`, 'warn');
                }
            } catch (localErr) {
                app.log('AI: Yerel sunucuya erişilemedi. Doğrudan tarayıcı istemci moduna geçiliyor.', 'info');
            }

            // 2. Yol (Fallback): Yerel sunucu başarısızsa doğrudan tarayıcıdan API anahtarı ile istek at
            if (!success) {
                if (!this.apiKey) {
                    document.getElementById('ai-loading-indicator')?.remove();
                    this.appendSystemMessage('Sistem: Yerel sunucu API anahtarı eksik ve arayüzde de bir anahtar girilmemiş. Lütfen .env dosyasını doldurun veya yukarıdan anahtarınızı kaydedin.');
                    app.log('AI: Gemini API anahtarı bulunamadı!', 'error');
                    return;
                }

                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: this.chatHistory,
                        systemInstruction: {
                            parts: [{ text: systemInstruction }]
                        }
                    })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error?.message || 'API Hatası');
                }

                responseData = await response.json();
                app.log('AI: Doğrudan Gemini API istemci kanalıyla yanıt alındı.', 'ok');
            }

            // Yükleniyor ibaresini kaldır
            document.getElementById('ai-loading-indicator')?.remove();

            const replyText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '[Yanıt alınamadı]';

            // Yapay zeka yanıtını geçmiş kaydına ve arayüze ekle
            this.chatHistory.push({
                role: 'model',
                parts: [{ text: replyText }]
            });

            this.appendMessage('NODE-1.5', replyText, false);

        } catch (err) {
            document.getElementById('ai-loading-indicator')?.remove();
            app.log(`AI Hatası: ${err.message}`, 'error');
            this.appendSystemMessage(`Bağlantı hatası: ${err.message}`);
        }
    }
};

// Modülü Başlat
window.addEventListener('DOMContentLoaded', () => {
    ai.init();
});
