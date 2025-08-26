module.exports = async ({ sock, msg, from }) => {
  const text = `Sathanic Bot — Menu\n!alive - Check bot\n!menu - ഈ മെനു\n!tagall - എല്ലാവരെയും tag ചെയ്യുക (group admin ആവശ്യമാണ്)\n!sticker - മീഡിയയുമായി reply ചെയ്ത് !sticker അയയ്ക്കുക\n!ytmp3 <url> - YouTube നിന്ന് MP3\n!download <url> - സാധാരണ ഡൗൺലോഡ്`
  await sock.sendMessage(from, { text }, { quoted: msg })
}
