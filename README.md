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
📦 Sıfır Framework — Tamamen Saf Web Teknolojileri
```

| Teknoloji | Kullanım Amacı |
|-----------|----------------|
| **HTML5** | Semantik SPA yapısı, erişilebilirlik (ARIA) |
| **CSS3** | Tasarım sistemi, animasyonlar, glassmorphism |
| **Vanilla JavaScript (ES6+)** | Uygulama mantığı ve durum yönetimi |
| **Canvas API** | Piksel manipülasyonu, gauge grafikleri, thermal lens |
| **Web Audio API** | Ses analizi ve gerçek zamanlı spektrogram |
| **CryptoJS** | AES-256 mesaj ön şifreleme (CDN) |
| **FontAwesome** | İkon seti (CDN) |
| **Google Fonts** | Orbitron & Share Tech Mono yazı tipleri |

---

## 🚀 Kurulum

Herhangi bir kurulum veya bağımlılık gerektirmez. Sadece tarayıcın yeterli!

```bash
# 1. Repoyu klonla
git clone https://github.com/mehmeteminyilmaz/shadow-protocol.git

# 2. Proje klasörüne gir
cd shadow-protocol

# 3. index.html dosyasını tarayıcında aç
# (ya da bir local server başlat)
npx serve .
```

> ⚠️ **Not:** Canvas API ve dosya okuma işlemleri için `file://` protokolü yerine bir local HTTP sunucusu önerilir.

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
│
├── css/
│   └── style.css       # Siberpunk tasarım sistemi (CSS değişkenleri, animasyonlar)
│
├── js/
│   ├── app.js          # Sekme yönetimi, terminal log, dashboard gauge'lar
│   ├── cipher.js       # Caesar, Vigenère, XOR algoritmaları ve görselleştiriciler
│   ├── stego.js        # Görsel/ses steganografi ve thermal diff lens
│   └── missions.js     # Görev senaryoları ve ilerleme takibi
│
└── README.md
```

---

## 🗺️ Yol Haritası

- [x] HTML5 SPA iskeleti ve semantik yapı
- [x] Siberpunk CSS tasarım sistemi ve animasyonlar
- [ ] SPA sekme yönetimi ve terminal log sistemi (`app.js`)
- [ ] Caesar, Vigenère ve XOR şifreleme motorları (`cipher.js`)
- [ ] Görsel steganografi ve Thermal Diff Lens (`stego.js`)
- [ ] Ses steganografisi ve Spektrogram (`stego.js`)
- [ ] Görev senaryoları ve ilerleme sistemi (`missions.js`)
- [ ] GitHub Pages ile canlı yayın

---

## 🤝 Katkı

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir `issue` açarak neyi değiştirmek istediğini belirt.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

