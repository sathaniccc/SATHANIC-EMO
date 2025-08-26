const axios = require("axios")
const crypto = require("crypto")
const { exec } = require("child_process")

module.exports = {
    name: "termux",
    execute: async (sock, msg, args) => {
        const from = msg.key.remoteJid
        const cmd = args[0]
        const query = args.slice(1).join(" ")

        if (!cmd) {
            return sock.sendMessage(from, {
                text: `🖥️ *Termux Tools Menu*  
.termux ip <ip> → IP Info  
.termux hash <text> → SHA256 Hash  
.termux ping <site> → Ping test  
.termux whois <domain> → WHOIS Lookup`
            }, { quoted: msg })
        }

        try {
            if (cmd === "ip") {
                if (!query) return sock.sendMessage(from, { text: "❌ IP കൊടുക്കൂ" }, { quoted: msg })
                const res = await axios.get(`http://ip-api.com/json/${query}`)
                const d = res.data
                await sock.sendMessage(from, {
                    text: `🌍 *IP Info* (${query})  
Country: ${d.country}  
Region: ${d.regionName}  
City: ${d.city}  
ISP: ${d.isp}`
                }, { quoted: msg })
            }

            else if (cmd === "hash") {
                if (!query) return sock.sendMessage(from, { text: "❌ Text കൊടുക്കൂ" }, { quoted: msg })
                const hash = crypto.createHash("sha256").update(query).digest("hex")
                await sock.sendMessage(from, { text: `🔐 *SHA256 Hash*\n${hash}` }, { quoted: msg })
            }

            else if (cmd === "ping") {
                if (!query) return sock.sendMessage(from, { text: "❌ Site കൊടുക്കൂ (ex: google.com)" }, { quoted: msg })
                exec(`ping -c 4 ${query}`, (err, stdout) => {
                    if (err) return sock.sendMessage(from, { text: "⚠️ Ping നടത്താൻ കഴിഞ്ഞില്ല." }, { quoted: msg })
                    sock.sendMessage(from, { text: `📡 *Ping Result*\n${stdout}` }, { quoted: msg })
                })
            }

            else if (cmd === "whois") {
                if (!query) return sock.sendMessage(from, { text: "❌ Domain കൊടുക്കൂ" }, { quoted: msg })
                exec(`whois ${query}`, (err, stdout) => {
                    if (err) return sock.sendMessage(from, { text: "⚠️ Whois നടത്താൻ കഴിഞ്ഞില്ല." }, { quoted: msg })
                    sock.sendMessage(from, { text: `🌐 *WHOIS Result*\n${stdout.slice(0, 1500)}` }, { quoted: msg })
                })
            }

            else {
                await sock.sendMessage(from, { text: "❌ Unknown Termux command." }, { quoted: msg })
            }
        } catch (e) {
            console.error(e)
            await sock.sendMessage(from, { text: "⚠️ Termux tool error." }, { quoted: msg })
        }
    }
}
