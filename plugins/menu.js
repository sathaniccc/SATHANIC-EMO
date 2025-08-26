
module.exports = {
    name: "menu",
    desc: "📜 Available commands കാണിക്കുക",
    execute: async (sock, msg) => {
        const from = msg.key.remoteJid
        let text = "📜 *Sathanic Emo Bot — Menu*\n\n"

        global.commands.forEach((cmd, name) => {
            text += `🔹 .${name} → ${cmd.desc || "No description"}\n`
        })

        await sock.sendMessage(from, { text }, { quoted: msg })
    }
}
