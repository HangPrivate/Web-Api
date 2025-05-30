const axios = require('axios');
const cheerio = require('cheerio');

// ================= SCRAPE FUNCTIONS =================

const baseUrls = {
  latest: "https://nontonanime.live/",
  orderAnime: "https://nontonanime.live/anime/?status&type&order",
  search: "https://nontonanime.live/?s="
};

async function searchAnime(query) {
  try {
    const { data } = await axios.get(baseUrls.search + encodeURIComponent(query));
    const $ = cheerio.load(data);
    const searchResults = [];

    $(".bsx a").each((_, element) => {
      searchResults.push({
        title: $(element).attr("title"),
        url: $(element).attr("href"),
        episode: $(element).find(".bt .epx").text().trim(),
        type: $(element).find(".limit .typez").text().trim(),
        thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
      });
    });

    return searchResults;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function getUpcomingAnime() {
  try {
    const { data } = await axios.get(baseUrls.orderAnime);
    const $ = cheerio.load(data);
    const upcomingList = [];

    $(".listupd .bsx a").each((_, element) => {
      const episode = $(element).find(".bt .epx").text().trim();

      if (episode.toLowerCase() === "upcoming") {
        upcomingList.push({
          title: $(element).attr("title"),
          url: $(element).attr("href"),
          episode,
          type: $(element).find(".limit .typez").text().trim(),
          thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
        });
      }
    });

    return upcomingList;
  } catch (error) {
    console.error("Error fetching upcoming anime:", error);
    return [];
  }
}

async function getLatestAnime() {
  try {
    const { data } = await axios.get(baseUrls.latest);
    const $ = cheerio.load(data);
    const animeList = [];

    $(".listupd.normal .bsx a").each((_, element) => {
      animeList.push({
        title: $(element).attr("title"),
        url: $(element).attr("href"),
        episode: $(element).find(".bt .epx").text().trim(),
        type: $(element).find(".limit .typez").text().trim(),
        thumbnail: $(element).find(".lazyload").attr("data-src") || $(element).find("img").attr("src"),
      });
    });

    return animeList;
  } catch (error) {
    console.error("Error fetching latest anime:", error);
    return [];
  }
}

async function getDownloadLinks(episodeUrl) {
  try {
    const { data } = await axios.get(episodeUrl);
    const $ = cheerio.load(data);
    const downloadLinks = [];

    $(".mirror option").each((_, element) => {
      const encodedValue = $(element).attr("value");
      if (encodedValue) {
        const buffer = Buffer.from(encodedValue, "base64");
        const decodedLink = buffer.toString("utf-8");

        downloadLinks.push({
          server: $(element).text().trim(),
          link: decodedLink.includes("<iframe")
            ? cheerio.load(decodedLink)("iframe").attr("src")
            : decodedLink
        });
      }
    });

    return downloadLinks;
  } catch (error) {
    console.error("Error fetching download links:", error);
    return [];
  }
}

// ================= ROUTES =================

module.exports = function(app) {

  // Route: /nontonanime/search?q=one+piece
  app.get('/nontonanime/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, error: 'Parameter q is required' });

    try {
      const results = await searchAnime(q);
      res.json({ status: true, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Failed to fetch search results' });
    }
  });

  // Route: /nontonanime/upcoming
  app.get('/nontonanime/upcoming', async (req, res) => {
    try {
      const results = await getUpcomingAnime();
      res.json({ status: true, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Failed to fetch upcoming anime' });
    }
  });

  // Route: /nontonanime/latest
  app.get('/nontonanime/latest', async (req, res) => {
    try {
      const results = await getLatestAnime();
      res.json({ status: true, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Failed to fetch latest anime' });
    }
  });

  // Route: /nontonanime/download?url=https://nontonanime.live/episode/...
  app.get('/nontonanime/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, error: 'Parameter url is required' });

    try {
      const results = await getDownloadLinks(url);
      res.json({ status: true, results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Failed to fetch download links' });
    }
  });

};
