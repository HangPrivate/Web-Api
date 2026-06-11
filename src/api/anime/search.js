const axios = require('axios')

module.exports = function(app) {

  app.get('/hang/search', async (req, res) => {
    try {

      const { query } = req.query

      if (!query) {
        return res.status(400).json({
          status: false,
          error: 'query is required'
        })
      }

      const { data } = await axios.get(
        `https://www.sankavollerei.com/anime/search/${encodeURIComponent(query)}`,
        {
          timeout: 10000
        }
      )

      res.json({
        status: true,
        creator: 'Hang',
        result: data.animeList || data
      })

    } catch (e) {

      res.status(500).json({
        status: false,
        error: e.message
      })

    }
  })

}