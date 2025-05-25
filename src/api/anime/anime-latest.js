const axios = require('axios');
const cheerio = require('cheerio');

async function getLatestAnime() {
  const url = 'https://animedao.lv/series/?status=&type=&order=update';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  return $('.listupd article.bs').map((_, el) => {
    const a = $(el).find('a');
    return {
      title: a.attr('title') || $(el).find('h2').text(),
      link: a.attr('href'),
      image: $(el).find('img').attr('src'),
      status: $(el).find('.epx').text(),
      sub: $(el).find('.sb').text()
    };
  }).get();
}

module.exports = function(app) {
  app.get('/anime/latest', async (req, res) => {
    try {
      const animeList = await getLatestAnime();
      res.status(200).json({ status: true, result: animeList });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: 'Failed to fetch anime list' });
    }
  });
};
