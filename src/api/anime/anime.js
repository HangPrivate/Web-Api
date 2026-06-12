const axios = require('axios')

module.exports = function(app) {

  app.get('/hang/anime', async (req, res) => {
    try {

      const { slug } = req.query

      if (!slug) {
        return res.status(400).json({
          status: false,
          error: 'slug is required'
        })
      }

      const { data } = await axios.get(
        `https://www.sankavollerei.com/anime/anime/${slug}`,
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