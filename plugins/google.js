const axios = require("axios")

module.exports = {
    name: "google",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const query = args.join(" ")
        if (!query) return sock.sendMessage(from, { text: "❌ Search query കൊടുക്കൂ:\n.google <text>" }, { quoted: msg })

        try {
            const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`
            const res = await axios.get(url)
            const answer = res.data.AbstractText || "No direct result found."

            await sock.sendMessage(from, { text: `🔎 *Search:* ${query}\n\n📌 ${answer}` }, { quoted: msg })
        } catch (e) {
            await sock.sendMessage(from, { text: "⚠️ Google search ചെയ്യുമ്പോൾ പിശക്." }, { quoted: msg })
        }
    }
}
