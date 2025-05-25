const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function getNonce() {
    try {
        const { data } = await axios.get("https://chatgpt4o.one/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive"
            }
        });
        const $ = cheerio.load(data);
        return $("div.wpaicg-chat-shortcode").attr("data-nonce") || null;
    } catch (error) {
        console.error("Error fetching nonce:", error.message);
        return null;
    }
}

async function chatWithGPT(message) {
    try {
        const nonce = await getNonce();
        if (!nonce) throw new Error("Failed to get nonce.");

        const clientId = generateRandomString(10);
        const formData = new FormData();
        formData.append("_wpnonce", nonce);
        formData.append("post_id", 11);
        formData.append("url", "https://chatgpt4o.one/");
        formData.append("action", "wpaicg_chat_shortcode_message");
        formData.append("message", message);
        formData.append("bot_id", 0);
        formData.append("chatbot_identity", "shortcode");
        formData.append("wpaicg_chat_history", JSON.stringify([]));
        formData.append("wpaicg_chat_client_id", clientId);

        const { data } = await axios.post(
            "https://chatgpt4o.one/wp-admin/admin-ajax.php",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Origin": "https://chatgpt4o.one",
                    "Referer": "https://chatgpt4o.one/",
                    "X-Requested-With": "XMLHttpRequest"
                }
            }
        );

        return data;
    } catch (error) {
        console.error("Error sending message:", error.message);
        throw new Error("No result found");
    }
}

module.exports = function(app) {
    app.get('/ai/chatgpt4o', async (req, res) => {
        try {
            const { text } = req.query;
            if (!text) {
                return res.status(400).json({ status: false, error: 'Text is required' });
            }

            const result = await chatWithGPT(text);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
