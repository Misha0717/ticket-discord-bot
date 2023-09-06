const { ActionRowBuilder, ChannelType, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    name: "interactionCreate",

    run: async ( client, interaction) => {
        if (interaction.isCommand()) {

        } else {
            if (interaction.customId == "create-ticket") {
                console.log("creating ticket...")
                let CreatedTicket = false

                const modal = new ModalBuilder({
                    customId: `ticket-modal-${interaction.user.id}`,
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

                const filter = (interaction) => interaction.customId === `ticket-modal-${interaction.user.id}`
                interaction
                    .awaitModalSubmit({ filter, time:30000_000 })
                    .then(async (modalInteraction) => {

                        if (CreatedTicket) {
                            return
                        }

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
                                CreatedTicket = true
                                modalInteraction.reply({ content: `You have succesfully created ticket: <#${createdTicketChannel.id}>`, ephemeral: true })
                            }
                        })
                    })
            }
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}