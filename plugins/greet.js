module.exports = {
    name: "greet",   // ഇത് prefix command ആയി വേണ്ട, auto-trigger ആയി മാത്രം
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            ""

        if (!text) return

        const lower = text.toLowerCase()

        if (
            lower.includes("hi") ||
            lower.includes("hello") ||
            lower.includes("hallo")
        ) {
            await sock.sendMessage(
                from,
                { text: "👋 ഹായ്! ഞാൻ സഹായിക്കാം. `.menu` ടൈപ്പുചെയ്യുക" },
                { quoted: msg }
            )
        }
    }
}
