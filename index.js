// ===============================
// SATHANIC-EMO WhatsApp Bot
// ===============================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const qrcode = require("qrcode-terminal")

// ===============================
// Main Function
// ===============================
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session")

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false, // ❌ deprecated, അതുകൊണ്ട് false ആക്കി
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
    // Save Creds (session)
    // ===============================
    sock.ev.on("creds.update", saveCreds)

    // ===============================
    // Basic Command Example
    // ===============================
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message) return

        const from = msg.key.remoteJid
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text

        if (text?.toLowerCase() === "alive") {
            await sock.sendMessage(from, { text: "👋 I am Alive, SATHANIC-EMO Bot Connected!" })
        }
    })
}

// ===============================
// Start Bot
// ===============================
startBot()
