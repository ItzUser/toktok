const SnapTikClient = require('./client.js'); // Path yang benar di Vercel
const axios = require('axios');
const path = require('path');

module.exports = async (req, res) => {
    console.log('Request masuk:', req.query);

    const { url } = req.query;
    if (!url) {
        console.log('Error: URL tidak ditemukan!');
        return res.status(400).json({ error: 'URL TikTok wajib diisi!' });
    }

    console.log('Membuat instance SnapTikClient...');
    const snapTik = new SnapTikClient();

    try {
        console.log('Memproses URL:', url);
        const result = await snapTik.process(url);

        console.log('Hasil:', result);

        if (result.type === 'video' || result.type === 'photo' || result.type === 'slideshow') {
            const videoUrl = result.data.sources[0].url;

            console.log('Video URL ditemukan:', videoUrl);

            const response = await axios.get(videoUrl, { responseType: 'stream' });

            res.setHeader('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
            res.setHeader('Content-Type', 'video/mp4');

            console.log('Mengirim file...');
            response.data.pipe(res);
        } else {
            console.log('Gagal mendapatkan video/foto!');
            res.status(500).send('Gagal mendapatkan video/foto!');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses link!' });
    }
};

