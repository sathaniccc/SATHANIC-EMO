const axios = require("axios")

module.exports = {
    name: "lyrics",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const song = args.join(" ")
        if (!song) return sock.sendMessage(from, { text: "❌ പാട്ടിന്റെ പേര് കൊടുക്കൂ: .lyrics <song>" }, { quoted: msg })

        try {
            const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song)}`)
            if (!res.data.lyrics) return sock.sendMessage(from, { text: "⚠️ Lyrics കിട്ടിയില്ല." }, { quoted: msg })

            await sock.sendMessage(from, { text: `🎶 *Lyrics for ${song}*\n\n${res.data.lyrics.slice(0, 2000)}` }, { quoted: msg })
        } catch (e) {
            await sock.sendMessage(from, { text: "⚠️ Lyrics കിട്ടിയില്ല." }, { quoted: msg })
        }
    }
}
