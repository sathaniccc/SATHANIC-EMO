module.exports = {
    name: "uptime",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const uptime = process.uptime()
        const hours = Math.floor(uptime / 3600)
        const minutes = Math.floor((uptime % 3600) / 60)
        const seconds = Math.floor(uptime % 60)

        await sock.sendMessage(from, {
            text: `⏳ Bot Uptime: *${hours}h ${minutes}m ${seconds}s*`
        }, { quoted: msg })
    }
}
