const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-avatar")
    .setDescription("Change the bot's avatar")
    .addAttachmentOption(option => 
      option.setName("avatar")
        .setDescription("Image to set as bot avatar")
        .setRequired(true)),

  async execute(interaction) {
    // Acknowledge the interaction
    await interaction.deferReply();

    const attachment = interaction.options.getAttachment("avatar");

    // Check if the attachment is a valid image URL
    if (attachment.contentType && attachment.contentType.startsWith("image/")) {
      try {
        await interaction.client.user.setAvatar(attachment.url);
        await interaction.editReply({ content: "Bot avatar has been updated!" });
      } catch (error) {
        console.error("Error setting avatar:", error);
        await interaction.editReply({ content: "There was an error updating the avatar." });
      }
    } else {
      await interaction.editReply({ content: "Please upload a valid image file." });
    }
  },
};
