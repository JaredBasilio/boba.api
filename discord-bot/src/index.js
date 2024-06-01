require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', (c) => {
    console.log(`✅ ${c.user.tag} is online`)
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'help') {
        interaction.reply('https://docs.google.com/document/d/1LOYGqNL0tc-4rAfZAESvPcWgzTecnK5AD-zb9Ub0dn8/edit?usp=sharing');
    }

    if (interaction.commandName === 'createGame') {
        const name = interaction.options.get('name').value;
        const description = interaction.options.get('description')?.value;
    }
    // console.log(interaction.commandName);
})

client.login(process.env.TOKEN)