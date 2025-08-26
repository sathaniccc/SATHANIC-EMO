const fs = require("fs")
const path = require("path")

global.commands = new Map()

function loadPlugins() {
    const files = fs.readdirSync(path.join(__dirname, "plugins")).filter(f => f.endsWith(".js"))
    for (const file of files) {
        const plugin = require(`./plugins/${file}`)
        if (plugin.name) {
            global.commands.set(plugin.name, plugin)
            console.log(`✅ Loaded plugin: ${plugin.name}`)
        }
    }
}
loadPlugins()
