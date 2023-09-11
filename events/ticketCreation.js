const { ActionRowBuilder, ChannelType, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    name: "interactionCreate",

    run: async ( client, interaction) => {
        if (interaction.isCommand()) {

        } else {
            if (interaction.customId == "create-ticket") {
                let randomNumber = Math.floor(Math.random() * 10)
                const modal = new ModalBuilder({
                    customId: `ticket-modal-${interaction.user.id}-${randomNumber}`,
                    title: "Title"
                })

                const ticketTitle = new TextInputBuilder({
                    customId: "ticket-title",
                    label: "Title",
                    style: TextInputStyle.Short,
                })
        
                const ticketDescription = new TextInputBuilder({
                    customId: "ticket-description",
                    label: "Description",
                    style: TextInputStyle.Paragraph,
                })
    

                const Title = new ActionRowBuilder().addComponents(ticketTitle)
                const Description = new ActionRowBuilder().addComponents(ticketDescription)

                modal.addComponents(Title, Description)
                await interaction.showModal(modal)

                const filter = (interaction) => interaction.customId === `ticket-modal-${interaction.user.id}-${randomNumber}`
                await interaction
                    .awaitModalSubmit({ filter, time:30000_000 })
                    .then(async (modalInteraction) => {
                        const CreateTicket = await modalInteraction.guild.channels.create({
                            name: "test",
                            type: ChannelType.GuildText,
                            parent: config.channels.TicketChannelTypes,
                            permissionOverwrites: [
                                {
                                    id: modalInteraction.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                            ]
                        }).then(async createdTicketChannel => {

                            if (modalInteraction) {
                                modalInteraction.reply({ content: `You have succesfully created ticket: <#${createdTicketChannel.id}>`, ephemeral: true })
                            }
                        })
                    })
                    .catch(error => {
                        console.log("received error: ", error)
                    })
            }
        }
    }
}