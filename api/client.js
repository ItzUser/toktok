const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

class Resource {
  constructor(url, index) {
    this.index = index;
    this.url = url;
  }

  download(config = {}) {
    return axios({
      url: this.url,
      responseType: 'stream',
      ...config
    });
  }
}

class SnapTikClient {
  constructor(config = {}) {
    this.axios = axios.create({
      baseURL: 'https://snaptik.app',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
      },
      ...config
    });
  }

  async get_token() {
    const { data } = await this.axios.get('/');
    const $ = cheerio.load(data);
    return $('input[name="token"]').val();
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

      const $ = cheerio.load(data);
      const videoUrl = $('a.download-file').attr('href');

      if (!videoUrl) throw new Error('Gagal menemukan link video.');

      console.log('Video URL ditemukan:', videoUrl);

      return {
        type: 'video',
        data: { sources: [new Resource(videoUrl, 0)] }
      };
    } catch (error) {
      console.error('Error processing URL:', error.message);
      throw error;
    }
  }
}

module.exports = SnapTikClient;
