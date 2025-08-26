const { downloadContentFromMessage } = require("@whiskeysockets/baileys")
const fs = require("fs")
const { exec } = require("child_process")

module.exports = {
    name: "sticker",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage

        if (!quoted) {
            return await sock.sendMessage(from, { 
                text: "⚠️ Sticker സജ്ജീകരണം: ഒരു *image/video* reply ചെയ്ത് `.sticker` ടൈപ്പ് ചെയ്യുക." 
            }, { quoted: msg })
        }

        let mime
        if (quoted.imageMessage) mime = "image"
        else if (quoted.videoMessage) mime = "video"
        else return await sock.sendMessage(from, { text: "❌ Image അല്ലെങ്കിൽ Video മാത്രം support ചെയ്യുന്നു." }, { quoted: msg })

        try {
            const buffer = []
            const stream = await downloadContentFromMessage(
                mime === "image" ? quoted.imageMessage : quoted.videoMessage,
                mime
            )
            for await (const chunk of stream) buffer.push(chunk)
            const mediaBuffer = Buffer.concat(buffer)

            const inputPath = `/tmp/sticker_input_${Date.now()}.${mime === "image" ? "jpg" : "mp4"}`
            const outputPath = `/tmp/sticker_${Date.now()}.webp`

            fs.writeFileSync(inputPath, mediaBuffer)

            // ffmpeg convert to webp
            exec(`ffmpeg -i ${inputPath} -vf scale=512:512 -y ${outputPath}`, async (err) => {
                if (err) {
                    console.error("FFmpeg error:", err)
                    return await sock.sendMessage(from, { text: "❌ Sticker convert error!" }, { quoted: msg })
                }

                await sock.sendMessage(from, {
                    sticker: fs.readFileSync(outputPath)
                }, { quoted: msg })

                fs.unlinkSync(inputPath)
                fs.unlinkSync(outputPath)
            })
        } catch (e) {
            console.error("Sticker error:", e)
            await sock.sendMessage(from, { text: "❌ Sticker process error!" }, { quoted: msg })
        }
    }
}
