const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const os = require('os')

module.exports = async ({ sock, msg, args, from }) => {
  const url = args[0]
  if (!url) return sock.sendMessage(from, { text: 'ലിങ്ക് നൽകുക: !ytmp3 <url>' }, { quoted: msg })
  try {
    const info = await ytdl.getInfo(url)
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 \-]/g, '')
    const out = `/tmp/${title}.mp3`
    const stream = ytdl(url, { quality: 'highestaudio' })
    await new Promise((resolve, reject) => {
      ffmpeg(stream).audioBitrate(128).save(out).on('end', resolve).on('error', reject)
    })
    const buffer = fs.readFileSync(out)
    await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: msg })
    fs.unlinkSync(out)
  } catch (e) {
    console.error(e)
    await sock.sendMessage(from, { text: 'ytmp3 നടത്തുമ്പോൾ പിശക്.' }, { quoted: msg })
  }
}
