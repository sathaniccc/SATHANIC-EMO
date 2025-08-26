// Sticker creation usually needs: download media, convert to webp using ffmpeg or cwebp
module.exports = async ({ sock, msg, from }) => {
  await sock.sendMessage(from, { text: 'Sticker സജ്ജീകരണം: ഒരു image/video എന്നോട് reply ചെയ്ത് !sticker ടൈപ്പ് ചെയ്യുക.' }, { quoted: msg })
}
