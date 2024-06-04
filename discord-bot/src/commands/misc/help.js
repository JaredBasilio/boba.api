const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');

const description = 'Documentation can be found here\n https://docs.google.com/document/d/1LOYGqNL0tc-4rAfZAESvPcWgzTecnK5AD-zb9Ub0dn8/edit?usp=sharing \n';

const embed = new EmbedBuilder()
    .setDescription(description);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Learn about how to use the bot.'),
    async execute(interaction) {
        await interaction.reply({
            embeds: [embed]
        })
    }
}