const axios = require("axios")

module.exports = {
    name: "quote",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        try {
            const res = await axios.get("https://api.quotable.io/random")
            const quote = res.data.content
            const author = res.data.author

            await sock.sendMessage(from, { text: `💡 *${quote}*\n— ${author}` }, { quoted: msg })
        } catch (e) {
            await sock.sendMessage(from, { text: "⚠️ Quote കിട്ടിയില്ല." }, { quoted: msg })
        }
    }
}
