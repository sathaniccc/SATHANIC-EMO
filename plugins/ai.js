const { Configuration, OpenAIApi } = require("openai")

const openai = new OpenAIApi(new Configuration({
  apiKey: "5e5a17fc-3cad-44e6-87b8-3dd390b28078" // 👉 OpenAI API Key add ചെയ്യണം
}))

module.exports = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    const from = m.key.remoteJid
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ""

    if (text.startsWith(".ai")) {
      const q = text.replace(".ai", "").trim()
      if (!q) return sock.sendMessage(from, { text: "❌ ചോദ്യം കൊടുക്കൂ!" })

      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Malayalam-ൽ മറുപടി കൊടുക്കു: " + q }]
      })

      await sock.sendMessage(from, { text: res.choices[0].message.content })
    }
  })
}
