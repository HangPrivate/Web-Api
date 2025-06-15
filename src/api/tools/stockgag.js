const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(app) {
    async function scrapeStockData() {
        const url = 'https://growagardenvalues.com/stock/stocks.php';

        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            const stockData = {};

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

            stockData['cosmetics'] = extractStock('cosmetics-section');
            stockData['egg'] = extractStock('eggs-section');
            stockData['gear'] = extractStock('gears-section');
            stockData['event'] = extractStock('event-shop-stock-section');
            stockData['seed'] = extractStock('seeds-section');

            return stockData;
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
            throw new Error('Gagal mengambil data stok.');
        }
    }

    app.get('/tools/stockgag', async (req, res) => {
        try {
            const data = await scrapeStockData();
            res.status(200).json({ status: true, data });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
