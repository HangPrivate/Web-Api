const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
  const url = 'https://growagardenvalues.com/stock/stocks.php';

  async function scrapeStockData() {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      const stockData = {};

      // Fungsi untuk mengambil data dari setiap section
      function extractStock(sectionId) {
        const section = $(`#${sectionId}`);
        const items = [];

        section.find('.stock-item').each((i, el) => {
          const itemName = $(el).find('.item-name').text().trim();
          const itemQuantity = $(el).find('.item-quantity').text().trim();
          items.push({ name: itemName, quantity: itemQuantity });
        });

        return items;
      }

      // Ekstrak semua bagian
      stockData['cosmetics'] = extractStock('cosmetics-section');
      stockData['egg'] = extractStock('eggs-section');
      stockData['gear'] = extractStock('gears-section');
      stockData['event'] = extractStock('event-shop-stock-section');
      stockData['seed'] = extractStock('seeds-section');

      return stockData;

    } catch (error) {
      console.error('Scraping Error:', error);
      throw new Error('Gagal mengambil data stok.');
    }
  }

  // ROUTE GET: /api/stocks
  app.get('/tools/stocksgag', async (req, res) => {
    try {
      const data = await scrapeStockData();
      res.status(200).json({ status: true, data });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  });
};
