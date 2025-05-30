const axios = require('axios');

async function ffstalk(playerId) {
  const data = JSON.stringify({
    "app_id": 100067,
    "login_id": playerId
  });

  const config = {
    method: 'POST',
    url: 'https://kiosgamer.co.id/api/auth/player_id_login',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
      'sec-ch-ua-mobile': '?1',
      'Origin': 'https://kiosgamer.co.id',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://kiosgamer.co.id/',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cookie': 'source=mb; region=CO.ID; mspid2=d175049875f78d90e7618f10b5930826; _ga=GA1.1.1096715143.1744003536; language=id; datadome=Oh~Qd6USZYfQps_cIi6V06MyaYyU4M8goxVzxq6lyoLUu6ml9hRkiA6eiMdmFuBr6hwB52PiydIWCRZxWtdE1FQLBGu7nqW5mfbBfXbSLbhg7XlKtPfOVTOzJ4OhLFgm; session_key=4txikks54uzrbj9hz174ic2g8ma0zd2p; _ga_Q7ESEPHPSF=GS1.1.1744003535.1.1.1744004048.0.0.0'
    },
    data: data
  };

  const response = await axios.request(config);

  return {
    playerId: playerId,
    playerData: response.data,
    searchedAt: new Date().toISOString()
  };
}

module.exports = function(app) {
  // Route: /ffstalk?playerId=12345678
  app.get('/stalk/ffstalk', async (req, res) => {
    const { playerId } = req.query;
    if (!playerId) {
      return res.status(400).json({ status: false, error: "Parameter 'playerId' is required" });
    }

    try {
      const result = await ffstalk(playerId);
      res.json({ status: true, result });
    } catch (error) {
      console.error('FFStalk Error:', error.message);
      res.status(500).json({ status: false, error: "Failed to fetch FF data" });
    }
  });
};
