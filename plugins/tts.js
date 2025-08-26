const gTTS = require("gtts")
const fs = require("fs")

module.exports = {
    name: "പറ",   // Command = .പറ
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const text = args.join(" ") || "ഹലോ സുഹൃത്തേ"

        try {
            const gtts = new gTTS(text, "ml")
            const filename = `/tmp/voice_${Date.now()}.mp3`

            gtts.save(filename, () => {
                sock.sendMessage(
                    from,
                    { audio: { url: filename }, mimetype: "audio/mp4", ptt: true },
                    { quoted: msg }
                )
                // Delete temp file
                setTimeout(() => {
                    fs.unlinkSync(filename)
                }, 5000)
            })
        } catch (e) {
            console.error("TTS Error:", e)
            await sock.sendMessage(from, { text: "❌ Voice generate ചെയ്യുമ്പോൾ പിശക്!" }, { quoted: msg })
        }
    }
}
