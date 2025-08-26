const axios = require("axios")
const fs = require("fs")

module.exports = {
    name: "download",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return await sock.sendMessage(
                from,
                { text: "❌ URL നൽകുക:\n.download <url>" },
                { quoted: msg }
            )
        }

        try {
            const res = await axios.get(url, { responseType: "arraybuffer" })
            const file = `/tmp/download_${Date.now()}`
            fs.writeFileSync(file, Buffer.from(res.data))

            await sock.sendMessage(
                from,
                {
                    document: fs.readFileSync(file),
                    fileName: "download",
                    mimetype: "application/octet-stream"
                },
                { quoted: msg }
            )

            fs.unlinkSync(file)
        } catch (e) {
            console.error("❌ Download error:", e)
            await sock.sendMessage(
                from,
                { text: "⚠️ Download ചെയ്യുമ്പോൾ പിശക്!" },
                { quoted: msg }
            )
        }
    }
}
