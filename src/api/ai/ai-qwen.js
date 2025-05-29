const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

async function qwenai(message, systemMessage, chatType) {
    const model = 'qwen-max-latest';

    const messages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
    ];

    try {
        const { data } = await axios.post('https://chat.qwen.ai/api/chat/completions', {
            stream: false,
            chat_type: chatType,
            model: model,
            messages: messages,
            session_id: uuidv4(),
            chat_id: uuidv4(),
            id: uuidv4()
        }, {
            headers: {
                                      accept: '*/*',
                                      'accept-encoding': 'gzip, deflate, br',
                                      'accept-language': 'en-US,en;q=0.9',
                                      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI0YWVhLTNjMjEtNDgwMi05YWY0LTdjZThkNmEwZTE3MSIsImV4cCI6MTc1MDA5MTA2OX0.sDC1jJ4WPlyGzgVi6x6m4vQ31miAOxa1MedflPNKG38',
                                      'bx-v': '2.5.28',
                                      'content-type': 'application/json',
                                      cookie: '_gcl_aw=GCL.1744865954.EAIaIQobChMI04zMmaTejAMVibpLBR0vgx8VEAAYASAAEgK8aPD_BwE; _gcl_gs=2.1.k1$i1744865952$u64539133; _gcl_au=1.1.1153047962.1744865954; _bl_uid=7jmmh9e2ksXwg25g02g8jXsjmn64; acw_tc=0a03e55a17474990039571388e56a2dd601a641b88c7c4cf572eed257291c4; x-ap=ap-southeast-5; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI0YWVhLTNjMjEtNDgwMi05YWY0LTdjZThkNmEwZTE3MSIsImV4cCI6MTc1MDA5MTA3OH0.W87CVNXvRVE2ZZ2SaAGAThhRC0Ro_4vnENwoXxfC698; ssxmod_itna=Yqfx0D9DBAeeT4eIqmq4iu0xYTxewDAQDXDUdnq7U=GcD8OD0PO+6r5GkUnEAQ05Gq0Q45omR=DlgG0AiDCuPGfDQcYHOQQbhi5YzB7Oi3tK122GmqTst=+x3b8izRu4adC0=6D74i8Nxi1DG5DGexDRxikD7v4pE0YDeeDtx0rlxirP4D3DeaGrDDkDQKDXEA+D0bhbUx+iO8vDiPD=xi3PzD4j40TDD5W7F7IWaAiuCkbF8fEDCIAhWYDoZeE2noAwz8fytRDHmeBwAPCmdyyYYexeGD4BirrSYnwBiDtBCw/pEa6msTOUGOlRY79u+KcjFQ9R=+uCzYSe4iiGx8v4G5qu2tUiNG0w/RYYiN0DiYGzYGDD; ssxmod_itna2=Yqfx0D9DBAeeT4eIqmq4iu0xYTxewDAQDXDUdnq7U=GcD8OD0PO+6r5GkUnEAQ05Gq0Q45omRYD==R0YwKQGnxGae+O80xTODGNqT1iDyWeKWG1DP4CEKzCguiCBPQ+ytntiBGxjLwGQlDw4hATY4AY0dIRv/AS0er0hPdwUxW7r4U72xbAifUQude8L4VRfuUmD0/gufFDLKI45mQ7GQUDx9AB4XCAR0W7md7f7huOvdSx4P/pG+k4+re9DxD; SERVERID=c6e9a4f4599611ff2779ff17d05dde80|1747499111|1747499003; tfstk=gJZsWaZHGrsngaovhVXEFMViEDoX59Sy6KMYE-KwHcntGKN4eqHwbO4bRSPs6lot6BHjIAhxHnetGmNrHVKxkh3bAAkjHdet6DdLaSYOIVHx9pHiXq4Zgfljc-V5L_SP4R2imcCPagoivBStqhLvDIuppYojBzxEkO2immCFsrBzxRVi6QFaBmBIvxMtBm3tH2BIhYGxDf3v9eH-9mnxMVhppxkSBCLtk9wKtxnxMS3OdDhnHeCNlvISZR6i-qIseK6gQXtvDkMCdbyswvcQAAgsXyhBDYrICVG8QutYbQM7PkgzWOQt9l28uo3pd9n0LzNbkJBWyjaaUlgSciOSKyeujre1A_etfXmtEy1Wjcy7J8qimK8ibzyzm4EOfQcErxwSAkCpxjz8eDsrS3lWUXLXofKxdbWCdEYme5JLx5-2leutKvvNd9T4KVHndbWCdEYmWvD3u96BuJf..; isg=BBAQ2i6nTLt-yhCXMHk2N4Wb4Vxi2fQjOuiJTgrh1Ws-RaLvsOi0sns7GFMA1az7',
                                      host: 'chat.qwen.ai',
                                      origin: 'https://chat.qwen.ai',
                                      referer: 'https://chat.qwen.ai/',
                                      'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
                                      'sec-ch-ua-mobile': '?1',
                                      'sec-ch-ua-platform': '"Android"',
                                      'sec-fetch-dest': 'empty',
                                      'sec-fetch-mode': 'cors',
                                      'sec-fetch-site': 'same-origin',
                                      'source': 'h5',
                                      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
                                      'version': '0.0.101',
                                      'x-request-id': uuidv4()
                                  }
        });

        return data.choices[0].message.content;
    } catch (error) {
        console.error('QwenAI Error:', error.message);
        throw new Error('QwenAI Error: ' + error.message);
    }
}

module.exports = function(app) {
    app.get('/ai/qwen-max', async (req, res) => {
        const { text, systemMessage, chatType, apikey } = req.query;

        if (!global.apikey.includes(apikey)) {
            return res.json("Apikey tidak valid.");
        }

        if (!text) {
            return res.status(400).json({
                status: false,
                error: '"text" parameter is required'
            });
        }

        const finalSystemMessage = systemMessage || "Anda adalah asisten cerdas yang membantu pengguna dalam dunia digital. anda harus ber perilaku seperti manusia yang ramah dan anda harus mmenjawab semua pertanyaa dengan benar";
        const finalChatType = chatType || "t2t";

        try {
            const result = await qwenai(text, finalSystemMessage, finalChatType);
            res.status(200).json({ status: true, result });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
