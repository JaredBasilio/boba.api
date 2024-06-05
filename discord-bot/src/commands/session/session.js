const { SlashCommandBuilder } = require("discord.js");
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('session')
        .setDescription('Session functions.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('get')
            .setDescription('Get the actions of a session'))
        ,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        
        const command = interaction.options.getSubcommand();
        const subcommandPath = path.join(__dirname, `subcommands/${command}.js`);
        const { execute } = require(subcommandPath);
        
        if (execute) {
            await execute(interaction);
        } else {
            console.log(`[WARNING] The subcommand ${command} is missing or the associated execute value function is missing.`)
        }
    }
}