const { SlashCommandBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server-info")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Server Info!")
  }
}
