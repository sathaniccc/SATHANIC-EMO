const ytdl = require("ytdl-core")
const ffmpeg = require("fluent-ffmpeg")
const fs = require("fs")

module.exports = {
    name: "ytmp3",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const url = args[0]

        if (!url) {
            return await sock.sendMessage(
                from,
                { text: "❌ ലിങ്ക് നൽകുക:\n.ytmp3 <youtube-url>" },
                { quoted: msg }
            )
        }

        try {
            const info = await ytdl.getInfo(url)
            const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 \-]/g, "")
            const out = `/tmp/${Date.now()}_${title}.mp3`

            const stream = ytdl(url, { quality: "highestaudio" })
            await new Promise((resolve, reject) => {
                ffmpeg(stream)
                    .audioBitrate(128)
                    .save(out)
                    .on("end", resolve)
                    .on("error", reject)
            })

            const buffer = fs.readFileSync(out)
            await sock.sendMessage(
                from,
                { audio: buffer, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
                { quoted: msg }
            )

            fs.unlinkSync(out)
        } catch (e) {
            console.error("ytmp3 error:", e)
            await sock.sendMessage(
                from,
                { text: "⚠️ ytmp3 നടത്തുമ്പോൾ പിശക്." },
                { quoted: msg }
            )
        }
    }
}
