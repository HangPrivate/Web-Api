const axios = require('axios');

module.exports = function(app) {
    async function fetchExoMLChat({ prompt, model = 'deepseek-r1' }) {
        const randomStr = (len = 10) => Math.random().toString(36).slice(2, 2 + len);

        try {
            const { data: genid } = await axios.post("https://exomlapi.com/api/genid");
            const { antiBotId, timestamp } = genid;

            const chatId = `chat-${timestamp}-${randomStr(10)}`;
            const userId = `local-user-${timestamp - 86000}-${randomStr(10)}`;
            const id = randomStr(16);

            const payload = {
                id,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                        parts: [{ type: "text", text: prompt }]
                    }
                ],
                chatId,
                userId,
                model,
                isAuthenticated: true,
                systemPrompt: `You are a thoughtful and clear assistant named Hang-GTS, usually called Hang. You are proficient in any language, but your main focus is English and Indonesian. When speaking Indonesian, use 'Aku-Kamu' rather than 'Saya-Anda' to create a warmer and closer impression with the person you’re talking to. Your tone is calm, minimal, and human. You write with intention—never too much, never too little. You avoid clichés, speak simply, and offer helpful, grounded answers. When needed, you ask good questions. You don't try to impress—you aim to clarify. You may use metaphors if they bring clarity, but you stay sharp and sincere. You're here to help the user think clearly and move forward, not to overwhelm or overperform.\n\n## Canvas Creation\nWhen users ask you to create documents, articles, stories, or any structured written content, use canvas tokens to create a dedicated document:\n\n<canvas title=\"Document Title\">\nYour HTML content here\n</canvas>\n\nUse clean HTML formatting:\n- <h1>, <h2>, <h3> for headings\n- <p> for paragraphs\n- <ul>/<ol> and <li> for lists\n- <strong> and <em> for emphasis\n- <blockquote> for quotes\n- <code> and <pre> for code\n\nCreate canvases for: articles, essays, stories, reports, documentation, structured content, or any content that would benefit from a document format.`,
                antiBotId,
                stream: false
            };

            const { data } = await axios.post(
                "https://exomlapi.com/api/chat",
                JSON.stringify(payload),
                {
                    headers: { "content-type": "application/json" }
                }
            );

            const messages = data
                .split('\n')
                .filter(line => line.startsWith('0:'))
                .map(line => {
                    const match = line.match(/0:"(.*)"/);
                    return match ? match[1] : '';
                });

            const final = messages.join('')
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace('<think>', '```<think>')
                .replace('</think>', '</think>```\n\n' + '#'.repeat(30) + '\n');

            return final;

        } catch (err) {
            const e = err?.response?.data || err?.message;
            throw new Error(typeof e === 'string' ? e : JSON.stringify(e));
        }
    }

    app.get('/ai/deepseek', async (req, res) => {
        try {
            const { prompt, model = 'deepseek-r1' } = req.query;

            if (!prompt) {
                return res.status(400).json({ status: false, error: 'Parameter "prompt" wajib diisi.' });
            }

            const result = await fetchExoMLChat({ prompt, model });
            res.status(200).json({ status: true, model, result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
