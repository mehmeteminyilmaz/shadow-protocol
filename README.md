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
![Version](https://img.shields.io/badge/VERSİON-1.0.0-00f0ff?style=for-the-badge&labelColor=050607)
![Language](https://img.shields.io/badge/VANILLA%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/LİSANS-MIT-bd00ff?style=for-the-badge&labelColor=050607)

<br>

> **ShadowProtocol**, görsel ve ses dosyalarına gizli mesajlar gömmeni, birden fazla şifreleme algoritmasını görsel olarak deneyimlemenizi ve gerçek bir siber ajan gibi hissettiren interaktif görev senaryolarını tamamlamanı sağlayan, tarayıcı tabanlı bir **Steganografi & Kriptografi İstasyonu**'dur.

<br>

[🕵️ Demo'yu Gör](#demo) • [🚀 Kurulum](#kurulum) • [🛠️ Özellikler](#özellikler) • [📖 Nasıl Çalışır](#nasıl-çalışır) • [🗺️ Yol Haritası](#yol-haritası)

</div>

---

## 🎯 Proje Hakkında

Modern web tarayıcılarının sunduğu güçlü API'leri (Canvas API, Web Audio API) kullanarak, herhangi bir arka uç sunucusu gerektirmeden çalışan bir **steganografi ve kriptografi laboratuvarı** oluşturuldu.

Proje hem eğitici hem de etkileşimli bir deneyim sunmayı hedefler:
- 📸 Bir görsele gizlenmiş mesajı **çıplak gözle ayırt edemezsin**
- 🔊 Bir ses dosyasına gömülen veriyi **kulakla duyamazsın**
- 🔐 Ancak doğru anahtar ile saniyeler içinde **her şeyi çözebilirsin**

---

## ✨ Özellikler

### 🖼️ Görsel Steganografi (LSB — Least Significant Bit)
| Özellik | Açıklama |
|---------|----------|
| **Encode** | PNG/BMP görsellerinin R, G, B kanallarının en önemsiz bitine mesaj gömme |
| **Decode** | Şifreli görsellerden mesajı piksel piksel okuma ve çözme |
| **AES-256 Entegrasyonu** | Mesaj önce AES-256 ile şifrelenir, sonra piksele gömülür |
| **Thermal Diff Lens** | Orijinal ile şifreli görsel arasındaki piksel farklarını kızılötesi sürüklemeli mercekle karşılaştırma |

### 🎵 Ses Steganografisi (WAV LSB)
| Özellik | Açıklama |
|---------|----------|
| **Encode** | `.wav` ses dosyasının örnekleme verilerine veri gömme |
| **Decode** | Şifreli ses dosyasından mesajı geri çıkarma |
| **Spektrogram Radar** | Web Audio API ile sesin frekanslarını gerçek zamanlı neon dalga görselleştirmesi |

### 🔐 Şifre Motoru (Cipher Engine)
| Algoritma | Görsel Araç |
|-----------|-------------|
| **Caesar Cipher** | Kaydırma miktarına göre dönen iç/dış alfabe çarkı |
| **Vigenère Cipher** | Harf-anahtar kesişimini anlık olarak gösteren dinamik matris tablosu |
| **XOR Cipher** | Bit düzeyinde işlemleri binary gösterimli akış panelinde adım adım görselleştirme |

### 🕵️ Görev Odası (Mission Control)
Steganografi ve şifrelemeyi gerçek bir senaryo ile öğrenmeni sağlayan 3 aşamalı interaktif görev modu:

```
GÖREV 1 → The Leak       → Ses dosyasına gizlenmiş mesajı çöz
GÖREV 2 → Thermal Intel  → Fotoğraftaki kaçış koordinatlarını bul
GÖREV 3 → Final Key      → İpuçlarını birleştirip son şifreyi kır
```

### 🎨 Arayüz ve Tasarım
- **Siberpunk Teması** — Koyu karbon arka plan, neon cyan/yeşil/mor tonlar
- **Glassmorphism Paneller** — `backdrop-filter` ile yarı saydam cam efekti
- **Glitch Animasyonu** — Logo başlığında CSS `clip-path` ile renk kayması efekti
- **Retro Scanlines** — Ekran üzerinde hafif tarama çizgisi katmanı
- **Canlı Terminal** — Alt kısımda sistem olaylarını anlık gösteren log akışı
- **Animasyonlu Gauge'lar** — Dashboard'da CPU ve RAM simülasyon grafikleri

---

## 🛠️ Kullanılan Teknolojiler

```
📦 Minimal Bağımlılık — Saf Web Teknolojileri + Hafif Backend
```

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **HTML5** | Semantik SPA yapısı, erişilebilirlik (ARIA) |
| **CSS3** | Tasarım sistemi, animasyonlar, glassmorphism |
| **Vanilla JavaScript (ES6+)** | Uygulama mantığı ve durum yönetimi |
| **Node.js + Express** | Sistem istatistikleri API'si ve Gemini AI proxy |
| **Canvas API** | Piksel manipülasyonu, gauge grafikleri, thermal lens |
| **Web Audio API** | Ses analizi ve gerçek zamanlı spektrogram |
| **CryptoJS** | AES-256 mesaj ön şifreleme (CDN) |
| **Gemini API** | AI asistan — kriptografi ve şifre ipuçları |
| **FontAwesome** | İkon seti (CDN) |
| **Google Fonts** | Orbitron & Share Tech Mono yazı tipleri |

---

## 🚀 Kurulum

```bash
# 1. Repoyu klonla
git clone https://github.com/mehmeteminyilmaz/shadow-protocol.git

# 2. Proje klasörüne gir
cd shadow-protocol

# 3. Bağımlılıkları yükle
npm install

# 4. .env dosyasını oluştur ve Gemini API anahtarını ekle
cp .env.example .env
# .env dosyasını düzenleyerek GEMINI_API_KEY değerini gir

# 5. Sunucuyu başlat
npm start
# → http://localhost:3000 adresinde çalışır
```

> ⚠️ **Not:** Gemini AI asistanı için geçerli bir API anahtarı gerekir. [Google AI Studio](https://aistudio.google.com/)'dan ücretsiz alabilirsin.

---

## 📖 Nasıl Çalışır

### Görsel Steganografi (LSB Algoritması)

Her renk kanalı (R, G, B) 8 bitten oluşur. Bu 8 bitin **en sağdaki bit** (LSB — Least Significant Bit), görsel kaliteyi neredeyse hiç etkilemeden veri depolamak için kullanılabilir.

```
Orijinal Piksel:   R=11001010  G=10110111  B=01001100
                                                ↓ Değişiklik
Şifreli Piksel:    R=11001011  G=10110110  B=01001101
                         ↑           ↑           ↑
                    Gizli bit    Gizli bit   Gizli bit
```

Gözle görülür bir fark oluşmaz çünkü her kanalda yalnızca **1 bit** (255 olasılıktan 1'i) değiştirilir.

### XOR Şifreleme

```
Mesaj:   H        =  01001000
Anahtar: X        =  01011000
XOR      sonucu   =  00010000  → (başka bir karakter)
```
XOR işlemi çift yönlüdür: aynı anahtar ile tekrar uygulandığında orijinal metne döner.

---

## 📁 Proje Yapısı

```
shadow-protocol/
│
├── index.html          # SPA iskelet ve tüm HTML yapısı
├── server.js           # Express sunucusu — sistem istatistikleri + Gemini proxy
├── .env                # API anahtarları (git'e gönderilmez)
│
├── css/
│   └── style.css       # Siberpunk tasarım sistemi (CSS değişkenleri, animasyonlar)
│
├── js/
│   ├── app.js          # Sekme yönetimi, terminal log, drag-drop, kopyalama
│   ├── cipher.js       # Caesar, Vigenère, XOR algoritmaları ve görselleştiriciler
│   ├── stego.js        # Görsel/ses steganografi ve thermal diff lens
│   ├── missions.js     # Görev senaryoları, localStorage ilerleme kaydı
│   └── ai.js           # Gemini AI asistan istemcisi
│
├── favicon.svg         # Siberpunk hexagon favicon
└── README.md
```

---

## 🗺️ Yol Haritası

- [x] HTML5 SPA iskeleti ve semantik yapı
- [x] Siberpunk CSS tasarım sistemi ve animasyonlar
- [x] SPA sekme yönetimi ve terminal log sistemi (`app.js`)
- [x] Drag & Drop dosya yükleme desteği
- [x] Tek tıkla kopyalama butonu (tüm çıktılar)
- [x] Caesar, Vigenère ve XOR şifreleme motorları (`cipher.js`)
- [x] Görsel steganografi ve Thermal Diff Lens (`stego.js`)
- [x] Ses steganografisi ve Spektrogram (`stego.js`)
- [x] Görev senaryoları ve localStorage ilerleme sistemi (`missions.js`)
- [x] Gemini AI Asistan entegrasyonu (`ai.js` + `server.js`)
- [x] Node.js backend — gerçek CPU/RAM istatistikleri
- [ ] GitHub Pages ile canlı yayın (backend gereksiz sürüm)
- [ ] Ek görev senaryoları (GÖREV 4+)
- [ ] Çoklu dil desteği (EN/TR)

---

## 🤝 Katkı

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir `issue` açarak neyi değiştirmek istediğini belirt.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

