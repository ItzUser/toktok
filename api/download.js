const SnapTikClient = require('./client.js');
const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;
  console.log('Request masuk:', req.query);

  if (!url) {
    console.warn('URL TikTok kosong!');
    return res.status(400).json({ error: 'URL TikTok wajib diisi!' });
  }

  console.log('Membuat instance SnapTikClient...');
  const snapTik = new SnapTikClient();

  try {
    console.log('Mulai memproses URL...');
    const result = await snapTik.process(url);

    if (result.type === 'video') {
      const videoUrl = result.data.sources[0];
      console.log('Video berhasil ditemukan:', videoUrl);

      const response = await axios.get(videoUrl, { responseType: 'stream' });

      res.setHeader('Content-Disposition', 'attachment; filename="tiktok_video.mp4"');
      res.setHeader('Content-Type', 'video/mp4');
      response.data.pipe(res);
    } else {
      console.error('Tipe konten tidak dikenali!');
      res.status(500).json({ error: 'Gagal mendapatkan video/foto!' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses link!' });
  }
};
