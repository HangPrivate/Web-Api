module.exports = function(app) {
    async function elaina() {
        try {
            const data = await fetchJson(`https://raw.githubusercontent.com/HangPrivate/database/refs/heads/main/anime/elaina.json`)
            const response = await getBuffer(data[Math.floor(data.length * Math.random())])
            return response
        } catch (error) {
            throw error;
        }
    }
    app.get('/random/elaina', async (req, res) => {
        try {
            const pedo = await elaina();
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
