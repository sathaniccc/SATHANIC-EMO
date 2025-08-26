const gTTS = require("gtts")

module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const from = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ""

    if (text.startsWith(".പറ")) {
      const msg = text.split(" ").slice(1).join(" ") || "ഹലോ സുഹൃത്തേ"
      const gtts = new gTTS(msg, "ml")
      gtts.save("voice.mp3", () => {
        sock.sendMessage(from, { audio: { url: "./voice.mp3" }, mimetype: "audio/mp4", ptt: true })
      })
    }
  })
}
