/* ============================================
   SHADOW PROTOCOL — SERVER.JS
   Güvenli API Proxy ve Statik Sunucu
   Görevler: .env dosyasından API anahtarını okur,
             istekleri Gemini'ye yönlendirir,
             statik dosyaları port 3000'de sunar.
   ============================================ */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('https');
const path = require('path');
const os = require('os');

// .env dosyasından ayarları yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware'ler
app.use(cors());
app.use(express.json());

// Statik dosyaları sun (index.html, css, js)
app.use(express.static(__dirname));

// Gemini API Proxy Rotası
app.post('/api/chat', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(400).json({
            error: {
                message: "Sunucuda API anahtarı yapılandırılmadı! Lütfen projenin yerel klasöründeki '.env' dosyasına GEMINI_API_KEY değerini ekleyin."
            }
        });
    }

    const { contents, systemInstruction } = req.body;

    const postData = JSON.stringify({
        contents,
        systemInstruction
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    // HTTPS İsteğini Başlat
    const proxyReq = http.request(options, (proxyRes) => {
        let responseData = '';

        proxyRes.on('data', (chunk) => {
            responseData += chunk;
        });

        proxyRes.on('end', () => {
            res.status(proxyRes.statusCode).send(responseData);
        });
    });

    proxyReq.on('error', (err) => {
        console.error('Gemini API Proxy Hatası:', err);
        res.status(500).json({
            error: {
                message: `Gemini API bağlantısı başarısız: ${err.message}`
            }
        });
    });

    proxyReq.write(postData);
    proxyReq.end();
});

// CPU Yükünü Hesaplama Yardımcı Fonksiyonları
function getCPUInfo() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
    for (const cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }
    const total = user + nice + sys + idle + irq;
    return { idle, total };
}

function getCPUUsage(callback) {
    const stats1 = getCPUInfo();
    setTimeout(() => {
        const stats2 = getCPUInfo();
        const idleDiff = stats2.idle - stats1.idle;
        const totalDiff = stats2.total - stats1.total;
        if (totalDiff === 0) {
            callback(0);
        } else {
            const percentage = 100 - Math.floor((100 * idleDiff) / totalDiff);
            callback(percentage);
        }
    }, 200);
}

// Canlı CPU & RAM Bilgisi Sağlayan Rota
app.get('/api/system-stats', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const ramUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);

    getCPUUsage((cpuUsage) => {
        res.json({
            cpu: cpuUsage,
            ram: ramUsage
        });
    });
});

// Bilinmeyen rotaları index.html'e yönlendir (SPA yapısı)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`[SHADOW_PROTOCOL] Sunucu başarıyla başlatıldı.`);
    console.log(`Adres: http://localhost:${PORT}`);
    console.log(`API Durumu: ${process.env.GEMINI_API_KEY ? 'ANAHTAR YÜKLENDİ' : 'ANAHTAR EKSİK (.env kontrol edin)'}`);
    console.log(`=================================================`);
});
