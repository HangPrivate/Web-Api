const axios = require('axios');

// ================= SCRAPE FUNCTION =================

async function ScrapeBMKG() {
  try {
    const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
    const earthquakeData = response.data.Infogempa.gempa;
    return {
      date: earthquakeData.Tanggal,
      time: earthquakeData.Jam,
      magnitude: earthquakeData.Magnitudo || earthquakeData.magnitude || 'Tidak tersedia',
      depth: earthquakeData.Kedalaman,
      location: earthquakeData.Wilayah,
      coordinates: earthquakeData.Coordinates,
      potential: earthquakeData.Potensi,
      feltIn: earthquakeData.Dirasakan || 'Tidak ada info dirasakan',
      shakemap: earthquakeData.Shakemap
        ? `https://data.bmkg.go.id/DataMKG/TEWS/${earthquakeData.Shakemap}`
        : null
    };
  } catch (error) {
    console.error('Error fetching earthquake data:', error.message);
    return null;
  }
}

// ================= ROUTE =================

module.exports = function(app) {
  // Route: /bmkg/gempa
  app.get('/tools/bmkg/gempa', async (req, res) => {
    try {
      const result = await ScrapeBMKG();
      if (!result) {
        return res.status(500).json({ status: false, error: 'Gagal mengambil data gempa dari BMKG' });
      }
      res.json({ status: true, result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Terjadi kesalahan saat mengambil data gempa' });
    }
  });
};
