const { default: makeWASocket, useMultiFileAuthState } = require("@adiwajshing/baileys")
const pino = require("pino")
const { loadCommands } = require("./lib/helper")

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const sock = makeWASocket({ logger: pino({ level: "silent" }), auth: state, printQRInTerminal: false })

  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode("918921016567") // 👉 ഇവിടെ നമ്പർ കൊടുക്കണം
    console.log("നിന്റെ WhatsApp Pairing Code:", code)
  }

  sock.ev.on("creds.update", saveCreds)
  sock.ev.on("connection.update", (u) => {
    if (u.connection === "open") console.log("✅ Sathanic Emo Connected")
  })

  loadCommands(sock)
}

startBot()￼Enter
