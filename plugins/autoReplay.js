exports.handler = async ({ sock, msg, text, from }) => {
  const lower = text.toLowerCase()
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hallo')) {
    await sock.sendMessage(from, { text: 'ഹായ്! ഞാൻ സഹായിക്കാം. !menu ടൈപ്പ്ചെയ്യുക' }, { quoted: msg })
    return
  }
  // മറ്റു സാദ്ധ്യമായ നിബന്ധനകൾ ഇവിടെ ചേർക്കാൻ കഴിയും
}
