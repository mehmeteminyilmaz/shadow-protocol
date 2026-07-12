<div align="center">

```
███████╗██╗  ██╗ █████╗ ██████╗  ██████╗ ██╗    ██╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██╔═══██╗██║    ██║
███████╗███████║███████║██║  ██║██║   ██║██║ █╗ ██║
╚════██║██╔══██║██╔══██║██║  ██║██║   ██║██║███╗██║
███████║██║  ██║██║  ██║██████╔╝╚██████╔╝╚███╔███╔╝
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝  ╚══╝╚══╝
     P R O T O C O L
```

### *Cyber Steganography & Cipher Station*

<br>

![Status](https://img.shields.io/badge/STATUS-OPERATIONAL-39ff14?style=for-the-badge&labelColor=050607)
![Version](https://img.shields.io/badge/VERSION-1.0.0-00f0ff?style=for-the-badge&labelColor=050607)
![Node](https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/VANILLA%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/LICENSE-MIT-bd00ff?style=for-the-badge&labelColor=050607)

<br>

> **ShadowProtocol**, görsel ve ses dosyalarına gizli mesajlar gömmenizi, birden fazla şifreleme algoritmasını görsel olarak deneyimlemenizi ve gerçek bir siber ajan gibi hissettiren interaktif görev senaryolarını tamamlamanızı sağlayan, tarayıcı tabanlı bir **Steganografi & Kriptografi İstasyonu**'dur.

<br>

[✨ Özellikler](#-özellikler) • [🚀 Kurulum](#-kurulum) • [📖 Nasıl Çalışır](#-nasıl-çalışır) • [📁 Proje Yapısı](#-proje-yapısı) • [🗺️ Yol Haritası](#-yol-haritası)

</div>

---

## 🎯 Proje Hakkında

Modern web API'lerini (Canvas API, Web Audio API) ve hafif bir Node.js backend'ini kullanarak oluşturulmuş interaktif bir **steganografi ve kriptografi laboratuvarı**.

- 📸 Bir görsele gizlenmiş mesajı **çıplak gözle ayırt edemezsin**
- 🔊 Bir ses dosyasına gömülen veriyi **kulakla duyamazsın**
- 🔐 Ancak doğru anahtar ile saniyeler içinde **her şeyi çözebilirsin**
- 🤖 Tüm süreçte **Gemini AI asistanı** sana rehberlik eder

---

## ✨ Özellikler

### 📡 Kontrol Merkezi (Dashboard)
| Özellik | Açıklama |
|---------|----------|
| **Canlı CPU & RAM Gauge'ları** | Node.js backend üzerinden ölçülen gerçek sistem istatistikleri; sunucu kapalıysa simülasyona otomatik geçer |
| **Sistem Terminal Logu** | Tüm uygulama olaylarını anlık izleyen renk kodlu log akışı (`info / ok / warn / error`) |
| **Sistem Saati** | Header'da her saniye güncellenen canlı saat |
| **Aktif Görev Paneli** | Görev ilerlemesine göre dinamik olarak güncellenen görev kartları |

### 🤖 Gemini AI Asistan (NODE-1.5)
| Özellik | Açıklama |
|---------|----------|
| **Çift Mod Bağlantı** | Önce backend proxy üzerinden dener; başarısız olursa doğrudan tarayıcı→API moduna geçer |
| **Sohbet Geçmişi** | Çok turlu konuşma desteği — önceki bağlamı hatırlar |
| **Kapsam Kısıtlaması** | Yalnızca steganografi, kriptografi ve görev ipuçlarına yanıt verir; konu dışı sorular siberpunk tarzında reddedilir |
| **localStorage Anahtar Kaydı** | API anahtarı tarayıcıda güvenle saklanır; sunucu `.env` değerini kullanır |

### 🖼️ Stego Lab — Görsel Steganografi (LSB)
| Özellik | Açıklama |
|---------|----------|
| **Encode** | PNG/BMP görselinin R, G, B kanallarına mesaj gömme |
| **AES-256 Ön Şifreleme** | Mesaj isteğe bağlı olarak gömülmeden önce AES-256 ile şifrelenir |
| **Encode Önizlemesi** | Çıktı görseli hem indirilir hem de sayfada inline olarak önizlenir |
| **Decode** | Şifreli görselden piksel piksel mesaj okuma ve AES çözme |
| **Thermal Diff Lens** | Orijinal ile şifreli görsel arasındaki piksel farklarını kızılötesi renk haritasıyla gösteren sürüklemeli mercek |

### 🎵 Stego Lab — Ses Steganografisi (WAV LSB)
| Özellik | Açıklama |
|---------|----------|
| **Encode** | `.wav` ses dosyasının PCM örnekleme verilerine (44-byte header atlanarak) veri gömme |
| **Decode** | Şifreli ses dosyasından mesajı geri çıkarma ve isteğe bağlı AES çözme |
| **Spektrogram Vizörü** | Web Audio API ile sesin frekans dağılımını gerçek zamanlı neon renk haritasıyla görselleştirme |

### 🔐 Şifre Motoru (Cipher Engine)
| Algoritma | Görsel Araç |
|-----------|-------------|
| **Caesar Cipher** | Shift değerine göre dönen iç/dış çift alfabe çarkı; A→D gibi canlı eşleşme gösterimi |
| **Vigenère Cipher** | Harf-anahtar kesişimini anlık olarak vurgulayan 26×26 dinamik matris tablosu |
| **XOR Cipher** | Bit düzeyinde işlemleri 8-bit binary akış panelinde karakter karakter görselleştirme |

### 🕵️ Görev Odası (Mission Control)
3 aşamalı, birbirini kilidini açan interaktif siber görev modu:

```
GÖREV 1 → The Leak       → Sızdırılmış ses dosyasındaki şifreli mesajı çöz
GÖREV 2 → Thermal Intel  → Uydu görüntüsüne gömülü kaçış koordinatlarını bul
GÖREV 3 → Final Key      → Caesar şifresiyle gizlenmiş son protokol kodunu kır
```

| Özellik | Açıklama |
|---------|----------|
| **Kilit Sistemi** | Her görev ancak bir önceki başarıyla tamamlandığında açılır |
| **localStorage İlerlemesi** | Sayfa yenilense de tamamlanan görevler hatırlanır |
| **Programatik Dosya Üretimi** | Görev dosyaları (WAV, PNG) tamamen tarayıcıda LSB ile gömülerek üretilir ve indirilir |
| **Canlı Dashboard Senkronizasyonu** | Tamamlanan görevler anında Kontrol Merkezi kartlarına yansır |
| **Sıfırla & Tekrar Oyna** | Tüm görevler tamamlandığında ilerleme sıfırlanabilir |

### 🎨 Arayüz ve UX
| Özellik | Açıklama |
|---------|----------|
| **Siberpunk Teması** | Koyu karbon arka plan, neon cyan / yeşil / mor tonlar |
| **Glassmorphism Paneller** | `backdrop-filter: blur` ile yarı saydam cam panel efekti |
| **Glitch Animasyonu** | Logo başlığında `clip-path` ile RGB renk kayması efekti |
| **Retro Scanlines** | Tüm ekranda hafif CRT tarama çizgisi katmanı |
| **Drag & Drop Yükleme** | Tüm upload alanlarına dosya sürükleyip bırakma desteği |
| **Tek Tıkla Kopyalama** | Her sonuç panelinde 📋 butonu ile panoya anlık kopyalama |
| **Siberpunk Favicon** | Tarayıcı sekmesinde neon cyan hexagon `S` ikonu |

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **HTML5 (Semantik)** | SPA iskeleti, ARIA erişilebilirlik etiketleri |
| **CSS3 (Vanilla)** | Tasarım token sistemi, animasyonlar, glassmorphism |
| **Vanilla JavaScript (ES6+)** | Tüm uygulama mantığı, modül mimarisi |
| **Node.js + Express** | Gemini API güvenli proxy & gerçek CPU/RAM istatistikleri |
| **Canvas API** | Piksel manipülasyonu, gauge grafikleri, thermal diff lens |
| **Web Audio API** | Ses analizi, gerçek zamanlı spektrogram görselleştirmesi |
| **CryptoJS (CDN)** | AES-256 mesaj şifreleme/çözme |
| **Gemini 2.5 Flash API** | Siberpunk AI asistan — çift mod bağlantı |
| **FontAwesome 6 (CDN)** | İkon seti |
| **Google Fonts** | Orbitron & Share Tech Mono |

---

## 🚀 Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/mehmeteminyilmaz/shadow-protocol.git
cd shadow-protocol

# 2. Bağımlılıkları yükle
npm install

# 3. .env dosyasını oluştur
cp .env.example .env

# 4. .env dosyasını düzenle ve Gemini API anahtarını gir
# GEMINI_API_KEY=your_api_key_here

# 5. Sunucuyu başlat
npm start
# → http://localhost:3000
```

> 💡 **API Anahtarı:** [Google AI Studio](https://aistudio.google.com/)'dan ücretsiz Gemini API anahtarı alabilirsin.
>
> ⚡ **Sunucusuz Mod:** Sunucu olmadan da çalışır — AI asistan için Kontrol Merkezi panelinden doğrudan API anahtarı girebilirsin.

---

## 📖 Nasıl Çalışır

### Görsel Steganografi (LSB Algoritması)

Her renk kanalı (R, G, B) 8 bitten oluşur. Mesaj bitleri her pikselin **en önemsiz bitine (LSB)** dağıtılır:

```
Orijinal Piksel:   R=11001010  G=10110111  B=01001100
                                                ↓ Değişiklik
Şifreli Piksel:    R=11001011  G=10110110  B=01001101
                         ↑           ↑           ↑
                    Gizli bit    Gizli bit   Gizli bit
```

Her kanalda yalnızca **1 bit** değiştiği için görsel kalite neredeyse etkilenmez (renk değişimi max ±1). İsteğe bağlı AES-256 ön şifrelemeyle mesaj piksellere gömülmeden önce de şifrelenir.

### Ses Steganografisi (WAV LSB)

WAV formatının 44-byte başlığı korunur. Mesaj bitleri PCM örnekleme verilerinin LSB'lerine sırayla yazılır. Mesaj sonuna null terminator (`\0`) eklenerek decode sırasında bitiş noktası belirlenir.

### XOR Şifreleme

```
Mesaj:   H        =  01001000
Anahtar: X        =  01011000
Sonuç:            =  00010000  → farklı karakter
```

XOR çift yönlüdür: aynı anahtar ile tekrar uygulandığında orijinal metne döner.

---

## 📁 Proje Yapısı

```
shadow-protocol/
│
├── index.html          # SPA iskeleti — tüm HTML yapısı ve sekmeler
├── server.js           # Express — Gemini proxy + sistem istatistikleri API'si
├── package.json        # Node.js bağımlılıkları (express, cors, dotenv)
├── .env                # API anahtarları (git'e gönderilmez)
├── .env.example        # Şablon .env dosyası
├── .gitignore          # node_modules, .env hariç tutulur
├── favicon.svg         # Siberpunk hexagon favicon (SVG)
│
├── css/
│   └── style.css       # Siberpunk tasarım sistemi — CSS değişkenleri,
│                       # animasyonlar, glassmorphism, tüm bileşen stilleri
│
└── js/
    ├── app.js          # Uygulama kontrolcüsü — sekme yönetimi,
    │                   # terminal log, drag-drop, kopyalama butonları,
    │                   # dashboard gauge animasyonları, sistem saati
    ├── cipher.js       # Şifreleme motorları — Caesar (dönen çark),
    │                   # Vigenère (26x26 matris), XOR (bit akış paneli)
    ├── stego.js        # Steganografi — görsel LSB encode/decode,
    │                   # thermal diff lens, ses LSB encode/decode,
    │                   # gerçek zamanlı spektrogram vizörü
    ├── missions.js     # Görev odası — programatik WAV/PNG üretimi,
    │                   # kilit sistemi, localStorage ilerleme kaydı,
    │                   # dashboard senkronizasyonu
    └── ai.js           # Gemini AI asistan — çift mod bağlantı,
                        # sohbet geçmişi, kapsam kısıtlaması
```

---

## 🗺️ Yol Haritası

- [x] HTML5 SPA iskeleti ve semantik yapı
- [x] Siberpunk CSS tasarım sistemi, animasyonlar, glassmorphism
- [x] Sekme ve alt-sekme yönetimi (SPA navigasyonu)
- [x] Canlı terminal log sistemi (renk kodlu, otomatik kaydırmalı)
- [x] Dashboard — gerçek CPU/RAM istatistikleri (Node.js) + simülasyon fallback
- [x] Sistem saati
- [x] Drag & Drop dosya yükleme (tüm upload alanları)
- [x] Tek tıkla kopyalama butonu (tüm çıktı panelleri)
- [x] Siberpunk hexagon favicon
- [x] Caesar Cipher — dönen çift çark görselleştirmesi
- [x] Vigenère Cipher — 26x26 dinamik matris tablosu
- [x] XOR Cipher — 8-bit binary akış paneli
- [x] Görsel LSB Steganografi — encode + AES-256 + inline önizleme
- [x] Görsel LSB Decode + AES-256 çözme
- [x] Thermal Diff Lens — sürüklemeli kızılötesi karşılaştırma merceği
- [x] Ses LSB Steganografisi — WAV encode + AES-256
- [x] Ses LSB Decode + AES-256 çözme
- [x] Gerçek zamanlı spektrogram vizörü (rolling canvas)
- [x] 3 aşamalı görev modu — kilit sistemi + programatik dosya üretimi
- [x] localStorage ile görev ilerlemesi kalıcılığı
- [x] Görev tamamlandıkça dashboard senkronizasyonu
- [x] Gemini AI asistan — çift mod bağlantı + kapsam kısıtlaması
- [ ] GitHub Pages canlı yayın (sunucusuz sürüm)
- [ ] Ek görev senaryoları (GÖREV 4+)
- [ ] Çoklu dil desteği (TR / EN)

---

## 🤝 Katkı

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir `issue` açarak neyi değiştirmek istediğini belirt.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
