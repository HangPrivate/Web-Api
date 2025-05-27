module.exports = function app (app) {
app.get('/imagecreator/sertifkat-tolol', async (req, res) => {
        try {
            const { text } = req.query
            const pedo = await getBuffer(`https://api.siputzx.my.id/api/m/sertifikat-tolol?text=${text}`)
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': pedo.length,
            });
            res.end(pedo);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}