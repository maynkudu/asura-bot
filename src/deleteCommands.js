const { Client, GatewayIntentBits } = require("discord.js")
require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const guildId = process.env.GUILD_ID

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  try {
    // Fetch the guild by ID
    const guild = client.guilds.cache.get(guildId)
    if (!guild) {
      console.error(`Guild with ID "${guildId}" not found.`)
      return;
    }

    // Fetch all commands for the guild
    const commands = await guild.commands.fetch()
    if (commands.size === 0) {
      console.log("No commands found to delete.")
      return
    }

    // Delete each command
    for (const command of commands.values()) {
      await guild.commands.delete(command.id)
      console.log(`Deleted command: ${command.name}`)
    }

    console.log("All guild-specific commands have been deleted.")
  } catch (error) {
    console.error("Error deleting guild-specific commands:", error)
  } finally {
    process.exit()
  }
});

client.login(process.env.TOKEN)
