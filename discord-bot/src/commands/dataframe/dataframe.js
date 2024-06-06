const { SlashCommandBuilder } = require("discord.js");
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dataframe')
        .setDescription('Dataframe functions.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-all')
            .setDescription('Get all dataframes or the dataframes of a game.')
            .addStringOption(option => option.setName('game').setDescription('Game we want dataframes from.')))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-author')
            .setDescription('Get dataframes by author.')
            .addUserOption(option => 
                option.setName('author')
                .setDescription('Author we want to see the games of.')
                .setRequired(true)
            )
        )
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