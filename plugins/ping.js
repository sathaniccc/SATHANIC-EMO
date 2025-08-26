const os = require("os")

module.exports = {
    name: "ping",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        const start = Date.now()

        try {
            // Send temp message to measure latency
            const sent = await sock.sendMessage(from, { text: "🏓 Pong checking..." }, { quoted: msg })
            const end = Date.now()
            const ping = end - start

            // Server Info
            const uptimeSec = process.uptime()
            const uptimeHrs = (uptimeSec / 3600).toFixed(2)
            const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
            const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
            const usedMem = (totalMem - freeMem).toFixed(2)

            const serverInfo = `✅ *Pong!*
⏱️ Response Time: *${ping} ms*

🖥️ *Server Info*
• Uptime: ${uptimeHrs} hrs
• Node.js: ${process.version}
• RAM: ${usedMem} GB / ${totalMem} GB`

            // Edit previous message with result
            await sock.sendMessage(from, { text: serverInfo }, { quoted: msg, edit: sent.key })
        } catch (e) {
            console.error("Ping error:", e)
            await sock.sendMessage(from, { text: "❌ Ping check error!" }, { quoted: msg })
        }
    }
}
