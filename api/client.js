const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

class SnapTikClient {
  constructor() {
    this.axios = axios.create({
      baseURL: 'https://snaptik.app',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      }
    });
  }

  async get_token() {
    console.log('Mengambil token dari SnapTik...');
    const { data } = await this.axios.get('/');
    const $ = cheerio.load(data);
    const token = $('input[name="token"]').val();
    console.log('Token didapat:', token);
    return token;
  }

  async process(url) {
    console.log('Memproses URL:', url);
    const token = await this.get_token();
    const form = new FormData();
    form.append('url', url);
    form.append('token', token);

    try {
      const { data } = await this.axios.post('/abc2.php', form);

      console.log('Data hasil SnapTik:', data);
      if (!data || data.includes('Error')) {
        throw new Error('Gagal memproses link TikTok!');
      }

      const $ = cheerio.load(data);
      const videoUrl = $('a.download-file').attr('href');
      if (!videoUrl) throw new Error('Gagal menemukan link video.');

      console.log('Video URL:', videoUrl);

      return {
        type: 'video',
        data: { sources: [videoUrl] }
      };
    } catch (error) {
      console.error('Error processing URL:', error.message);
      throw error;
    }
  }
}

module.exports = SnapTikClient;
