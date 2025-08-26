module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const from = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ""

    if (text.startsWith(".ജീവിച്ചിരിക്കുന്നു")) {
      await sock.sendMessage(from, { text: "✅ *Sathanic Emo Bot പ്രവർത്തിക്കുന്നു!*" })
    }
  })
}
