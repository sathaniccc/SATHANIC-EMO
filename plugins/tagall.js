module.exports = async ({ sock, msg, from, isGroup }) => {
  if (!isGroup) return sock.sendMessage(from, { text: 'Tagall groups-ലില് മാത്രം പ്രവർത്തിക്കും.' }, { quoted: msg })
  try {
    const meta = await sock.groupMetadata(from)
    const participants = meta.participants.map(p => p.id)
    await sock.sendMessage(from, { text: 'Tagging all...', mentions: participants }, { quoted: msg })
  } catch (e) {
    console.error(e)
    await sock.sendMessage(from, { text: 'Tagall ചെയ്യുമ്പോൾ പിശക് വന്നു.' }, { quoted: msg })
  }
}
