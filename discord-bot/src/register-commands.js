require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js')

const commands = [
    {
        name: 'help',
        description: 'Help',
    },
    {
        name: 'createGame',
        descrption: 'Create a game for BOBALab',
        options: [
            {
                name: 'name',
                description: 'Name of the game',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'description',
                description: 'Description for game',
                type: ApplicationCommandOptionType.String
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        )
        console.log('Slash commands registered successfully')
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();