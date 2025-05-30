const axios = require('axios');

// Ambil token validated dari halaman Blackbox
async function getValidatedToken() {
  try {
    const { data: html } = await axios.get('https://www.blackbox.ai', {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const match = html.match(/validated["']?\s*:\s*["']([a-z0-9-]{36})["']/i);
    return match?.[1] || null;
  } catch (err) {
    console.error('Gagal ambil token validated:', err.message);
    return null;
  }
}

// Fungsi Blackbox AI utama
async function blackboxAi(query) {
  const validated = await getValidatedToken();
  if (!validated) throw new Error('Gagal mengambil token validated');

  const payload = {
    messages: [{ role: 'user', content: query, id: '0quFtyH' }],
    id: 'KB5EUHk',
    validated,
    codeModelMode: true,
    asyncMode: false,
    imageGenerationMode: false
  };

   const headers = {
    'Accept': '/',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'id-ID,id;q=0.9',
    'Content-Type': 'application/json',
    'Origin': 'https://www.blackbox.ai',
    'Referer': 'https://www.blackbox.ai/',
    'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?1',
    'Sec-Ch-Ua-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
  };

  const { data } = await axios.post('https://www.blackbox.ai/api/chat', payload, { headers });
  const parsed = data.split('$~~~$');

  return {
    response: parsed[2]?.trim() || parsed[0]?.trim() || 'Tidak ada jawaban.',
    source: parsed[1] ? JSON.parse(parsed[1]) : []
  };
}

// Export router Express
module.exports = function (app) {
  app.get('/ai/blackbox', async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: false,
        message: "Query parameter 'q' is required"
      });
    }

    try {
      const result = await blackboxAi(q);
      res.status(200).json({ status: true, result });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `Gagal memproses permintaan: ${err.message}`
      });
    }
  });
};
