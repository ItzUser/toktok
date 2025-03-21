const SnapTikClient = require('./api/client.js'); // Path yang benar di Vercel
const axios = require('axios');
const path = require('path');

module.exports = async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL TikTok wajib diisi!' });
    }

    console.log('URL:', url); 

    const snapTik = new SnapTikClient();

    try {
        console.log('Memproses URL...');

        const result = await snapTik.process(url);

        if (['video', 'photo', 'slideshow'].includes(result.type)) {
            const videoUrl = result.data.sources[0].url;

            console.log('Video URL:', videoUrl);

            const response = await axios.get(videoUrl, { responseType: 'stream' });

            res.setHeader('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
            res.setHeader('Content-Type', 'video/mp4');

            response.data.pipe(res);
        } else {
            console.error('Gagal mendapatkan video/foto!');
            res.status(500).json({ error: 'Gagal mendapatkan video/foto!' });
        }
    } catch (error) {
        console.error('Error detail:', error.message || error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses link!' });
    }
};
