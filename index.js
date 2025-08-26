// ===============================
// SATHANIC-EMO Bot (Fixed Version)
// ===============================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const qrcode = require("qrcode-terminal")
const fs = require("fs")
const path = require("path")

// ===============================
// Plugin Loader
// ===============================
const plugins = {}
const pluginsPath = path.join(__dirname, "plugins")
fs.readdirSync(pluginsPath).forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(path.join(pluginsPath, file))
        plugins[command.name] = command
    }
})

// ===============================
// Main Function
// ===============================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state
    })

    // ===============================
    // QR Code Handling
    // ===============================
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
            console.log("📌 Scan ചെയ്യാനുള്ള QR:")
            qrcode.generate(qr, { small: true })
        }

        if (connection === "open") {
            console.log("✅ WhatsApp Connected Successfully!")
        } else if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            console.log("❌ Connection closed. Reconnecting:", shouldReconnect)
            if (shouldReconnect) {
                startBot()
            }
        }
    })

    // ===============================
    // Save Session
    // ===============================
    sock.ev.on("creds.update", saveCreds)

    // ===============================
    // Message Handler
    // ===============================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            msg.message.imageMessage?.caption ||
            ""

        if (!text) return

        // Prefix setup
        const prefix = "."
        if (text.startsWith(prefix)) {
            const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/)
            if (plugins[cmd]) {
                try {
                    await plugins[cmd].execute(sock, msg, args)
                } catch (e) {
                    console.error(e)
                    await sock.sendMessage(from, {
                        text: "❌ Command run ചെയ്യുമ്പോൾ error!"
                    })
                }
            }
        }
    })
}

// ===============================
// Start Bot
// ===============================
startBot()
