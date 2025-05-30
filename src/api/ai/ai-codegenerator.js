const axios = require("axios");

// Function untuk AI Code Generator
async function aiCodeGenerator(prompt, language) {
  const payload = {
    customInstructions: prompt,
    outputLang: language
  };

  const { data } = await axios.post("https://www.codeconvert.ai/api/generate-code", payload);
  
  return {
    code: data,
    prompt: prompt,
    language: language,
    generatedAt: new Date().toISOString()
  };
}

module.exports = function (app) {
  // Endpoint untuk AI Code Generator
  app.get('/ai/code-generator', async (req, res) => {
    const { prompt, language } = req.query;
    
    if (!prompt) {
      return res.status(400).json({
        status: false,
        message: "Query parameter 'prompt' is required"
      });
    }

    if (!language) {
      return res.status(400).json({
        status: false,
        message: "Query parameter 'language' is required"
      });
    }

    try {
      const results = await aiCodeGenerator(prompt, language);
      res.status(200).json({
        status: true,
        result: results
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: `Error: ${error.message}`
      });
    }
  });
