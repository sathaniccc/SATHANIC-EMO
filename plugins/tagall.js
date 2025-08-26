module.exports = {
    name: "tagall",
    execute: async (sock, msg, args, extra = {}) => {
        const from = msg.key.remoteJid
        const isGroup = from.endsWith("@g.us")

        if (!isGroup) {
            return await sock.sendMessage(
                from,
                { text: "⚠️ Tagall groups-ലിൽ മാത്രം പ്രവർത്തിക്കും." },
                { quoted: msg }
            )
        }

        try {
            const meta = await sock.groupMetadata(from)
            const participants = meta.participants.map(p => p.id)

            await sock.sendMessage(
                from,
                {
                    text: `📢 Group Tag:\n${participants.map(p => "@" + p.split("@")[0]).join(" ")}`,
                    mentions: participants
                },
                { quoted: msg }
            )
        } catch (e) {
            console.error("❌ Tagall error:", e)
            await sock.sendMessage(from, { text: "⚠️ Tagall ചെയ്യുമ്പോൾ പിശക് വന്നു." }, { quoted: msg })
        }
    }
}
