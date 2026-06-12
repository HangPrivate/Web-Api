const axios = require('axios')

module.exports = function(app) {

  app.get('/hang/episode', async (req, res) => {
    try {

      const { episodeId } = req.query

      if (!episodeId) {
        return res.status(400).json({
          status: false,
          error: 'episodeId is required'
        })
      }

      const { data } = await axios.get(
        `https://www.sankavollerei.com/anime/episode/${episodeId}`,
        {
          timeout: 10000
        }
      )

      res.json({
        status: true,
        creator: 'Hang',
        result: data.data
      })

    } catch (e) {

      res.status(500).json({
        status: false,
        error: e.message
      })

    }
  })

}