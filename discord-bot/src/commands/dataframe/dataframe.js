const { SlashCommandBuilder } = require("discord.js");
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dataframe')
        .setDescription('Dataframe functions.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-all')
            .setDescription('Get all dataframes.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-user')
            .setDescription('Get user dataframes.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get')
            .setDescription('Get a single dataframe.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('delete')
            .setDescription('Delete a dataframe.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('update')
            .setDescription('Update a dataframe.'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('sessions')
            .setDescription('Get all the sessions of a dataframe.')) 
        .addSubcommand(subcommand =>
            subcommand
            .setName('actions')
            .setDescription('Get all actions of a dataframe')) 
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