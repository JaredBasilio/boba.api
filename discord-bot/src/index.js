require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

eventHandler(client);

client.login(process.env.TOKEN)

// client.on('interactionCreate', async (interaction) => {
    // if (interaction.commandName === 'creategame') {
    //     const name = interaction.options.get('name').value;
    //     const description = interaction.options.get('description')?.value;

    //     const response = await fetch('https://bobaapi.up.railway.app/api/games', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             name: name,
    //             author: 'jared',
    //             description: description,
    //         })
    //     })
        
    //     if (response.ok) {
    //         const data = await response.json();
    //         interaction.reply({ content: `access key: \`${data.access_key}\`` });
    //     } else {
    //         interaction.reply({ content: `Failed to create game: ${response.statusText}` });
    //     }
    // }

//     const command = interaction.options.get('command').value;

// })