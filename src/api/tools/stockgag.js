const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function (app) {
  async function scrapeStockData() {
    try {
      const response = await axios.get('https://growagardenvalues.com/stock/stocks.php');
      const html = response.data;
      const $ = cheerio.load(html);

      const stockData = {};

      // Helper function
      const extractSection = (key, selector) => {
        stockData[key] = [];
        $(selector).each((i, el) => {
          stockData[key].push({
            name: $(el).find('.item-name').text().trim(),
            quantity: $(el).find('.item-quantity').text().trim(),
            image: $(el).find('.item-image img').attr('src')
          });
        });
      };

      extractSection('cosmetics', '#cosmetics-section .stock-item');
      extractSection('egg', '#eggs-section .stock-item');
      extractSection('gear', '#gears-section .stock-item');
      extractSection('event', '#event-shop-stock-section .stock-item');
      extractSection('seed', '#seeds-section .stock-item');

      return stockData;
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
      throw new Error('Failed to scrape data.');
    }
  }

  app.get('/tools/stockgag', async (req, res) => {
    try {
      const result = await scrapeStockData();
      res.status(200).json({
        status: true,
        result
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  });
};
