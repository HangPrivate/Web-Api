const axios = require('axios');
const cheerio = require('cheerio');

async function searchAnime(query) {
  const url = `https://animedao.lv/?s=${encodeURIComponent(query)}`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('.bixbox .listupd .bs').map((_, el) => ({
    title: $(el).find('.tt h2').text().trim(),
    link: $(el).find('a').attr('href'),
    image: $(el).find('img').attr('src'),
    status: $(el).find('.status').text().trim(),
    type: $(el).find('.typez').text().trim()
  })).get();
}

module.exports = function(app) {
  app.get('/anime/animedao/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ status: false, error: 'Query is required' });
      }

      const result = await searchAnime(query);
      res.status(200).json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Failed to search anime' });
    }
  });
};
