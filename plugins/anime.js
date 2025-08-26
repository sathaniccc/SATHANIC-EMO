const axios = require("axios")

module.exports = {
    name: "anime",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const query = args.join(" ")
        if (!query) return sock.sendMessage(from, { text: "❌ Anime character name കൊടുക്കൂ: .anime <name>" }, { quoted: msg })

        try {
            const res = await axios.get(`https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`)
            if (!res.data.data.length) return sock.sendMessage(from, { text: "⚠️ Character കണ്ടില്ല." }, { quoted: msg })

            const char = res.data.data[0]
            await sock.sendMessage(from, {
                image: { url: char.images.jpg.image_url },
                caption: `🎌 *${char.name}*\n📖 ${char.about?.slice(0, 200) || "No info"}...`
            }, { quoted: msg })
        } catch (e) {
            console.error(e)
            await sock.sendMessage(from, { text: "⚠️ Anime data കിട്ടിയില്ല." }, { quoted: msg })
        }
    }
}
