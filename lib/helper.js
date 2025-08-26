const fs = require("fs")
const path = require("path")

function loadCommands(sock) {
  const pluginPath = path.join(__dirname, "../plugins")
  fs.readdirSync(pluginPath).forEach(file => {
    require(path.join(pluginPath, file))(sock)
  })
}

module.exports = { loadCommands }
