const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const https = require("https")
const ColorThief = require("colorthief")

module.exports = {
    data : new SlashCommandBuilder()
    .setName('whoami')
    .setDescription('Tells your place in the server')
    ,

    async execute(interaction) {
        const user = interaction.user
        const member = interaction.guild.members.cache.get(user.id)
        const avatarUrl = user.displayAvatarURL({size: 1024, extension: 'png'})
        const bannerUrl = user.bannerURL({ size: 2048, extension: 'png' }) || null

        const roles = member.roles.cache
            .filter(role => role.name !== '@everyone')
            .map(role => role.name)
            .join(', ') || 'No roles';

        try {
            const buffer = await fetchImageAsBuffer(avatarUrl)
            const dominantColor = await ColorThief.getColor(buffer)
            const hexColor = `#${dominantColor.map(c => c.toString(16).padStart(2, "0")).join("")}`

            const embed = new EmbedBuilder()
                .setColor(hexColor)
                .setTitle(`${user.username}'s Information`)
                .setDescription(`Here is your information in the server:`)
                .setThumbnail(avatarUrl)
                .addFields(
                    { name: 'Username', value: user.tag, inline: true },
                    { name: 'User ID', value: user.id, inline: true },
                    { name: 'Roles', value: roles, inline: false },
                    {
                        name: 'Channel Access',
                        value: interaction.guild.channels.cache
                            .filter(channel => channel.permissionsFor(member).has('VIEW_CHANNEL'))
                            .map(channel => channel.name)
                            .join(', ') || 'No accessible channels',
                        inline: false
                    }
                )
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp()

            if (bannerUrl) {
                embed.setImage(bannerUrl)
            }

            await interaction.reply({ embeds: [embed] })

        } catch (error) {
            console.error("Error fetching user:", error)
            await interaction.reply({
            content: 'There was an error fetching your information or generating the embed.',
            ephemeral: true
      })
    }}
}


// Helper function to fetch an image as a buffer
function fetchImageAsBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });
    });
}