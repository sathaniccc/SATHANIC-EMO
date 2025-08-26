
module.exports = {
    name: "menu",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const text = `📌 Sathanic Bot — Menu
.alive - Check bot
.menu - ഈ മെനു
.tagall - എല്ലാവരെയും mention ചെയ്യുക (group admin ആവശ്യമാണ്)
.sticker - മീഡിയ reply ചെയ്ത് .sticker അയയ്ക്കുക
.ytmp3 <url> - YouTube നിന്ന് MP3 download
.download <url> - സാധാരണ download`

        await sock.sendMessage(from, { text }, { quoted: msg })
    }
}
