const axios = require('axios');
const cheerio = require('cheerio');

async function hotSeries() {
  const url = 'https://animedao.lv/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('article.bs').map((_, el) => ({
    title: $(el).find('h2').text().trim(),
    animeName: $(el).find('.tt').contents().first().text().trim(),
    episode: $(el).find('.epx').text().trim(),
    subtitle: $(el).find('.sb').text().trim(),
    image: $(el).find('img').attr('src'),
    link: $(el).find('a').attr('href'),
    upload: $(el).find('.timeago').text().trim()
  })).get();
}

module.exports = function(app) {
  app.get('/anime/hot', async (req, res) => {
    try {
      const result = await hotSeries();
      res.status(200).json({ status: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Failed to fetch hot anime series' });
    }
  });
};
