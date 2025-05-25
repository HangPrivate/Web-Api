const axios = require('axios');

module.exports = function(app) {
    app.get('/ai/deepseek', async (req, res) => {
        try {
            const { text } = req.query;

            if (!text || typeof text !== 'string' || text.trim() === "") {
                return res.status(400).json({
                    status: false,
                    error: "Parameter 'text' wajib diisi."
                });
            }

            // Model AI ditentukan otomatis oleh sistem (server)
            const model = "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b";

            const { data } = await axios.post("https://ai.clauodflare.workers.dev/chat", {
                model,
                messages: [{
                    role: "user",
                    content: text
                }]
            });

            let response = data?.data?.response || "";
            if (response.includes("</think>")) {
                response = response.split("</think>").pop().trim();
            }

            res.status(200).json({ status: true, result: response });
        } catch (error) {
            console.error("AI Error:", error.response?.data || error.message);
            res.status(500).json({ status: false, error: "Terjadi kesalahan di server." });
        }
    });
};
