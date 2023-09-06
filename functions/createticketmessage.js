const config = require("../config.js")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

function CreateTicketMessage(client) {
    let TicketChannel = config.channels.TicketChannel
    let ChannelData = client.channels.cache.get(TicketChannel)


    ChannelData.bulkDelete(10)
        .then(async () => {
        }).catch(async (error) => {
            if (error.code == 50034) {
                await interaction.reply({ content: `I can't remove message's older then 14 days old`})
            }
        });

    setTimeout(() => {
        try {
            const TicketEmbed = new EmbedBuilder()
                .setTitle("Create Ticket")
                .setDescription("To create a ticket click on the button down below.")
                .setColor("#8ABDF0")
                .setFooter({
                    text: config.server.name,
                    iconURL: client.user.displayAvatarURL({ size: 4096, format: 'png', dynamic: true }),
                })

            const TicketButton = new ButtonBuilder() 
                .setCustomId("create-ticket")
                .setLabel("Create Ticket")
                .setStyle(ButtonStyle.Primary)

            const row = new ActionRowBuilder()
			    .addComponents(TicketButton);

            const message = ChannelData.send({ embeds: [TicketEmbed], components: [row]})
        } catch (error) {
            console.log("Error while creating the ticket message: ", error)
        }
    }, 2000);
}

module.exports = { CreateTicketMessage }