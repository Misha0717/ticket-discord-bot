require("dotenv").config();
const { Client, Collection, IntentsBitField, ActivityType } = require("discord.js")
const path = require("path");
const fs = require('fs');
const discordbot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
    ],

    presence: {
        status: 'online'
    }
})

discordbot.commands = new Collection()
discordbot.arrayOfCommands = []

discordbot.on("ready", (client) => {
    client.user.setActivity({
        name: "Tickets",
        type: ActivityType.Watching
    })

    client.commands = new Collection();
    client.arrayOfCommands = [];

    LoadDiscordCommands(client)
    LoadDiscordEvents()

    console.log(`[Info] ${client.user.username} started up succesfully!`)

    setTimeout(() => {
        const { CreateTicketMessage } = require("./functions/createticketmessage.js")

        CreateTicketMessage(client)
    }, 2000);
})

discordbot.login(process.env.TOKEN)

function LoadDiscordCommands(client) {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if (!command.name) {
            console.log("command: " + command.name + " doesn't have a name?")
        }

        if (discordbot.commands.has(command.name)) {
            console.log("command " + command.name + " already exist!")
            continue;
        }

        discordbot.commands.set(command.name, command)
        discordbot.arrayOfCommands.push(command)
        console.log("load command: " + command.name)
    }

    const guild = client.guilds.cache.get(process.env.SERVERID);
    guild.commands.set(discordbot.arrayOfCommands).catch((error) => console.log(error));
}

function LoadDiscordEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once) discordbot.once(event.name, (...args) => event.run(discordbot, ...args));
        else discordbot.on(event.name, (...args) => event.run(discordbot, ...args));

        console.log("registered event: " + event.name)
    }
}