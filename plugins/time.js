module.exports = {
    name: "time",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const now = new Date()
        const date = now.toLocaleDateString("ml-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        const time = now.toLocaleTimeString("ml-IN")

        await sock.sendMessage(from, { text: `📅 ഇന്ന്: *${date}*\n⏰ സമയം: *${time}*` }, { quoted: msg })
    }
}
