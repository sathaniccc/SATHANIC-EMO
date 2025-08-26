exports.text = async (sock, to, text, quoted) => {
  return sock.sendMessage(to, { text }, { quoted })
}
