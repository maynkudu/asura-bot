const { Client, GatewayIntentBits, Collection, REST } = require("discord.js")
const { config } = require("dotenv")
const registerCommands = require("./registerCommands")

// Load environment variables
config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const guildId = process.env.GUILD_ID

// Initialize the commands collection
client.commands = new Collection()

// // Register commands globally
// registerCommands(client)

client.once("ready",async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  
  // Register commands for the specific guild
  try {
    const guild = client.guilds.cache.get(guildId)
    if (!guild) {
      console.error(`Guild with ID "${guildId}" not found.`)
      return
    }

    registerCommands(client, guildId)

    console.log(`Commands registered for guild: ${guild.name}`)
  } catch (error) {
    console.error("Error during setup:", error)
  }

  //Deletes all commands
  // try {
  //   const commands = await client.application.commands.fetch()

  //   for (const command of commands.values()) {
  //     await client.application.commands.delete(command.id)
  //     console.log(`Deleted global command: ${command.name}`)
  //   }

  //   console.log("All global commands have been deleted.")
  // } catch (error) {
  //   console.error("Error deleting global commands:", error)
  // }
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)
  if (command) {
    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({ content: "There was an error executing this command!"})
    }
  }
})

client.login(process.env.TOKEN)
