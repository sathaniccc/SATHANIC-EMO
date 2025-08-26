const { Configuration, OpenAIApi } = require("openai")

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "PUT-YOUR-API-KEY-HERE"
  })
)

module.exports = {
  name: "ai",
  execute: async (sock, msg, args) => {
    const from = msg.key.remoteJid
    const q = args.join(" ")

    if (!q) {
      return await sock.sendMessage(from, { text: "❌ ചോദ്യം കൊടുക്കൂ!" }, { quoted: msg })
    }

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Malayalam-ൽ മറുപടി കൊടുക്കു: " + q }]
      })

      const answer = res.choices[0].message.content
      await sock.sendMessage(from, { text: answer }, { quoted: msg })
    } catch (err) {
      console.error("AI error:", err)
      await sock.sendMessage(from, { text: "⚠️ AI error: " + err.message }, { quoted: msg })
    }
  }
}
