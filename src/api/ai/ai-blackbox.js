const axios = require("axios");

async function blackboxAi(query) {
  const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Origin': 'https://www.blackbox.ai',
    'Referer': 'https://www.blackbox.ai/',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
  };

  const payload = {
    messages: [{ role: 'user', content: query, id: '0quFtyH' }],
    id: 'KB5EUHk',
    codeModelMode: true,
    mobileClient: false,
    validated: '00f37b34-a166-4efb-bce5-1312d87f2f94',
    webSearchModeOption: {
      autoMode: true,
      webMode: false,
      offlineMode: false
    }
  };

  const { data } = await axios.post('https://www.blackbox.ai/api/chat', payload, {
    headers,
    timeout: 10000
  });

  const parsed = data.split('$~~~$');
  
  try {
    if (parsed.length === 1) {
      return {
        response: parsed[0].trim(),
        source: []
      };
    } else if (parsed.length >= 3) {
      const resultText = parsed[2].trim();
      const resultSources = JSON.parse(parsed[1]);
      return {
        response: resultText,
        source: resultSources.map(s => ({
          link: s.link,
          title: s.title,
          snippet: s.snippet,
          position: s.position
        }))
      };
    } else {
      throw new Error("Response format tidak dikenali.");
    }
  } catch (err) {
    throw new Error("Gagal parsing response dari Blackbox.");
  }
}

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
      const results = await blackboxAi(q);
      res.status(200).json({
        status: true,
        result: results
      });
    } catch (error) {
      console.error("Blackbox Error:", error.message);
      res.status(500).json({
        status: false,
        message: `Gagal memproses permintaan: ${error.message}`
      });
    }
  });
};
