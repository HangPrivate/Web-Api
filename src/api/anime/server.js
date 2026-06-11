const axios = require('axios')

module.exports = function(app) {

  app.get('/hang/server', async (req, res) => {
    try {

      const { serverId } = req.query

      if (!serverId) {
        return res.status(400).json({
          status: false,
          error: 'serverId is required'
        })
      }

      const { data } = await axios.get(
        `https://www.sankavollerei.com/anime/server/${serverId}`,
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