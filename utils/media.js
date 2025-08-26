const fs = require('fs')
exports.saveBufferToFile = (buffer, filepath) => {
  fs.writeFileSync(filepath, buffer)
}
