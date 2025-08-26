const axios = require("axios")
const fs = require("fs")

module.exports = {
    name: "removebg",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const quoted = msg.message?.imageMessage
        if (!quoted) return sock.sendMessage(from, { text: "❌ Reply ചെയ്യൂ ഒരു image-നെ: .removebg" }, { quoted: msg })

        try {
            const buffer = await sock.downloadMediaMessage(msg.message)
            fs.writeFileSync("input.jpg", buffer)

            const res = await axios({
                method: "POST",
                url: "https://api.remove.bg/v1.0/removebg",
                data: fs.createReadStream("input.jpg"),
                headers: {
                    "X-Api-Key": "YOUR_REMOVE_BG_API_KEY",
                },
                responseType: "arraybuffer"
            })

            fs.writeFileSync("output.png", res.data)
            await sock.sendMessage(from, { image: { url: "./output.png" }, caption: "✅ Background Removed" }, { quoted: msg })
            fs.unlinkSync("input.jpg")
            fs.unlinkSync("output.png")
        } catch (e) {
            console.error(e)
            await sock.sendMessage(from, { text: "⚠️ Background remove ചെയ്യുമ്പോൾ പിശക്." }, { quoted: msg })
        }
    }
}
