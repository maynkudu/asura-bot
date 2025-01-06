const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const https = require("https")
const ColorThief = require("colorthief")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Fetch a user's avatar")
    .addUserOption(option =>
      option.setName("user").setDescription("The user whose avatar you want to see")
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user
    const avatarUrl = user.displayAvatarURL({ size: 1024, extension: "png" })

    try {
      const buffer = await fetchImageAsBuffer(avatarUrl)
      const dominantColor = await ColorThief.getColor(buffer)

      const hexColor = `#${dominantColor.map(c => c.toString(16).padStart(2, "0")).join("")}`

      const avatarEmbed = new EmbedBuilder()
        .setColor(hexColor) // Use the dominant color
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarUrl)
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()

      await interaction.reply({ embeds: [avatarEmbed] })
    } catch (error) {
      console.error("Error fetching avatar or colors:", error)
      await interaction.reply({
        content: "There was an error fetching the avatar or extracting colors."
      })
    }
  },
}

// Helper function to fetch image as buffer
function fetchImageAsBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const data = []
      res.on("data", chunk => data.push(chunk))
      res.on("end", () => resolve(Buffer.concat(data)))
      res.on("error", err => reject(err))
    })
  })
}
