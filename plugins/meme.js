const axios = require("axios")

module.exports = {
    name: "meme",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        try {
            const res = await axios.get("https://meme-api.com/gimme")
            await sock.sendMessage(from, {
                image: { url: res.data.url },
                caption: `🤣 ${res.data.title}`
            }, { quoted: msg })
        } catch (e) {
            await sock.sendMessage(from, { text: "⚠️ Meme കിട്ടിയില്ല." }, { quoted: msg })
        }
    }
}
