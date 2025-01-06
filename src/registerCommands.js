const fs = require("fs")
const path = require("path")

async function registerCommands(client, guildId) {
  const commandsPath = path.join(__dirname, "commands")
  const categories = fs.readdirSync(commandsPath)

  const guild = client.guilds.cache.get(guildId)
  if (!guild) {
    throw new Error(`Guild with ID "${guildId}" not found.`)
  }

  const commandData = []

  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category)
    const commandFiles = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".js"))

    for (const file of commandFiles) {
      const command = require(path.join(categoryPath, file))

      if (command.data && command.execute) {
        client.commands.set(command.data.name, command)
        commandData.push(command.data.toJSON())
        console.log(`Loaded command: ${command.data.name}`)
      } else {
        console.warn(`Invalid command structure in file: ${file}`)
      }
    }
  }

  // Register the commands for guild
  await guild.commands.set(commandData);
  console.log(`Commands registered for guld ID: ${guildId}`)
}

module.exports = registerCommands
