const axios = require('axios');
const FormData = require('form-data');

module.exports = function(app) {
    async function fetchDeepSeekChat(prompt) {
        const headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9'
        };

        const maxTries = 5;
        for (let tries = 1; tries <= maxTries; tries++) {
            try {
                const main = await axios.get('https://deep-seek.chat/ai-assistants/general-ai-chat/', {
                    headers
                });

                const cookies = (main.headers['set-cookie'] || []).map(i => i.split(';')[0]).join('; ');
                const nonceMatch = main.data.match(/"nonce":"([a-zA-Z0-9]+)"/);
                const nonce = nonceMatch ? nonceMatch[1] : null;

                if (!nonce) throw new Error('Nonce tidak ditemukan');

                const form = new FormData();
                form.append('action', 'deepseek_chat');
                form.append('prompt', prompt);
                form.append('nonce', nonce);
                form.append('agent_id', '13');

                const res = await axios.post('https://deep-seek.chat/wp-admin/admin-ajax.php', form, {
                    headers: {
                        ...headers,
                        ...form.getHeaders(),
                        'cookie': cookies
                    }
                });

                const responseText = res.data?.data?.message;

                if (responseText?.toLowerCase().includes('busy')) {
                    if (tries < maxTries) await new Promise(r => setTimeout(r, 2000));
                    else return { error: true, message: 'Server sibuk, coba lagi nanti.', raw: res.data };
                } else {
                    return { success: true, result: responseText };
                }

            } catch (err) {
                if (tries < maxTries) await new Promise(r => setTimeout(r, 2000));
                else return { error: true, message: err.message };
            }
        }
    }

    app.get('/ai/deepseek', async (req, res) => {
        try {
            const { prompt } = req.query;

            if (!prompt) {
                return res.status(400).json({ status: false, error: 'Parameter "prompt" wajib diisi.' });
            }

            if (!global.apikey.includes(apikey)) {
                return res.status(401).json({ status: false, error: 'Apikey tidak valid.' });
            }

            const response = await fetchDeepSeekChat(prompt);

            res.status(200).json({
                status: true,
                result: response.result || response.message,
                ...(response.error && { error: true })
            });

        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
