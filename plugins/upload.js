const axios = require("axios")
const fs = require("fs")
const FormData = require("form-data")

module.exports = {
    name: "upload",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const quoted = msg.message?.documentMessage || msg.message?.imageMessage || msg.message?.videoMessage

        if (!quoted) {
            return sock.sendMessage(from, { text: "❌ Upload ചെയ്യാൻ ഒരു file-നെ reply ചെയ്യൂ (.upload)" }, { quoted: msg })
        }

        try {
            // Media download
            const buffer = await sock.downloadMediaMessage(msg.message)
            const filePath = `./temp_${Date.now()}`

            fs.writeFileSync(filePath, buffer)

            // Upload to AnonFiles
            const form = new FormData()
            form.append("file", fs.createReadStream(filePath))

            const res = await axios.post("https://api.anonfiles.com/upload", form, {
                headers: form.getHeaders()
            })

            fs.unlinkSync(filePath)

            if (!res.data.status) {
                return sock.sendMessage(from, { text: "⚠️ Upload പരാജയപ്പെട്ടു." }, { quoted: msg })
            }

            const link = res.data.data.file.url.full
            await sock.sendMessage(from, {
                text: `✅ *Upload Successful!*\n\n📂 File Link: ${link}`
            }, { quoted: msg })
        } catch (e) {
            console.error("Upload error:", e)
            await sock.sendMessage(from, { text: "❌ Upload ചെയ്യുമ്പോൾ പിശക്." }, { quoted: msg })
        }
    }
}
