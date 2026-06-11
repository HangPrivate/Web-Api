const axios = require('axios')

module.exports = function(app) {

  app.get('/hang/schedule', async (req, res) => {
    try {

      const { data } = await axios.get(
        'https://www.sankavollerei.com/anime/schedule',
        {
          timeout: 10000
        }
      )

      res.json({
        status: true,
        creator: 'Hang',
        result: data
      })

    } catch (e) {

      res.status(500).json({
        status: false,
        error: e.message
      })

    }
  })

}