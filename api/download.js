const SnapTikClient = require('./client.js'); // Path ke client.js di folder API
const axios = require('axios');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL TikTok wajib diisi!' });

    const snapTik = new SnapTikClient();

    try {
        const result = await snapTik.process(url);

        if (['video', 'photo', 'slideshow'].includes(result.type)) {
            const videoUrl = result.data.sources[0].url;

            const response = await axios.get(videoUrl, { responseType: 'stream' });

            res.setHeader('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
            res.setHeader('Content-Type', 'video/mp4');

            response.data.pipe(res);
        } else {
            res.status(500).json({ error: 'Gagal mendapatkan video/foto!' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses link!' });
    }
}
