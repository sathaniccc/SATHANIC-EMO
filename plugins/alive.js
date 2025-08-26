const os = require("os")
const moment = require("moment-timezone")

module.exports = {
    name: "alive",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid

        // 🕒 സമയം + തീയതി
        const time = moment().tz("Asia/Kolkata").format("hh:mm A")
        const date = moment().tz("Asia/Kolkata").format("DD/MM/YYYY")

        // 💻 System uptime
        const uptimeSec = process.uptime()
        const uptimeH = Math.floor(uptimeSec / 3600)
        const uptimeM = Math.floor((uptimeSec % 3600) / 60)
        const uptime = `${uptimeH}h ${uptimeM}m`

        // 📱 Device info (bot run ചെയ്യുന്ന system)
        const platform = os.platform()
        const arch = os.arch()
        const host = os.hostname()

        const text = `👋 *Sathanic Emo Bot പ്രവർത്തിക്കുന്നു!*

📅 തീയതി: ${date}
🕒 സമയം: ${time}
⏳ Uptime: ${uptime}

💻 Host: ${host}
⚙️ OS: ${platform} (${arch})

🔋 Battery: (Termux API വേണം battery level-ന്)
`

        await sock.sendMessage(from, { text }, { quoted: msg })
    }
}
