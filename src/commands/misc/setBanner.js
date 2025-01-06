const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('set-banner')
    .setDescription("Changes the bot's banner")
    .addAttachmentOption(option => 
        option.setName('banner').setDescription("Image to be set as the bot's banner").setRequired(true)
    ),

    async execute(interaction) {
        //Acknowledge the interaction
        await interaction.deferReply()

        //Get the attachment
        const attachment = interaction.options.getAttachment("banner")

        //Check the validity of the attachment
        if (attachment.contentType && attachment.contentType.startsWith("image/")) {
            try {
                //Change the bot's BANNER
                await interaction.client.user.setBanner(attachment.url)
                await interaction.editReply({content: "Bot's banner has been updated"})
            } catch (error) {
                console.log("Error setting banner:", error)
                await interaction.editReply({content: "There was an unexpected error"})
            } 
        } else {
            await interaction.editReply({content: "Please upload a valid image"})
        }
    }
}