const axios = require('axios');

async function saveweb2zip(url) {
    try {
        if (!url) throw new Error('Url is required');
        url = url.startsWith('https://') ? url : `https://${url}`;

        const { data } = await axios.post(
            'https://copier.saveweb2zip.com/api/copySite',
            {
                url,
                renameAssets: false,
                saveStructure: false,
                alternativeAlgorithm: false,
                mobileVersion: false
            },
            {
                headers: {
                    accept: '*/*',
                    'content-type': 'application/json',
                    origin: 'https://saveweb2zip.com',
                    referer: 'https://saveweb2zip.com/',
                    'user-agent': 'Mozilla/5.0'
                }
            }
        );

        const md5 = data.md5;
        if (!md5) throw new Error('Failed to get MD5');

        while (true) {
            const { data: status } = await axios.get(
                `https://copier.saveweb2zip.com/api/getStatus/${md5}`,
                {
                    headers: {
                        accept: '*/*',
                        'content-type': 'application/json',
                        origin: 'https://saveweb2zip.com',
                        referer: 'https://saveweb2zip.com/',
                        'user-agent': 'Mozilla/5.0'
                    }
                }
            );

            if (status.isFinished) {
                return {
                    url,
                    copiedFilesAmount: status.copiedFilesAmount || 0,
                    downloadUrl: `https://copier.saveweb2zip.com/api/downloadArchive/${status.md5}`,
                    error: {
                        text: status.errorText || null,
                        code: status.errorCode || null,
                    }
                };
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } catch (error) {
        console.error('SaveWeb2Zip Error:', error.message);
        throw new Error('No result found or service error');
    }
}

module.exports = function (app) {
    // Route: /saveweb2zip?url=https://example.com
    app.get('/tools/saveweb2zip', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ status: false, error: "Parameter 'url' is required" });

        try {
            const result = await saveweb2zip(url);
            res.json({ status: true, result });
        } catch (err) {
            res.status(500).json({ status: false, error: err.message });
        }
    });
};
