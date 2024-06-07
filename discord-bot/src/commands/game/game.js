const { SlashCommandBuilder } = require("discord.js");
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Game functions.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('Create a game'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get')
            .setDescription('Get a single game.')
            .addStringOption(option => 
                option.setName('game-id')
                    .setDescription('The game we want to get.')
                    .setRequired(true)
                    .setAutocomplete(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-all')
            .setDescription('Get All Games'))
        .addSubcommand(subcommand =>
            subcommand
            .setName('get-author')
            .setDescription('Get Games by Author')
            .addUserOption(option => 
                option.setName('author')
                .setDescription('Author we want to see the games of.')
                .setRequired(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName('update')
            .setDescription('Update a game.')
            .addStringOption(option => 
                option.setName('game-id')
                    .setDescription('The game we want to update.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option => 
                option.setName('access-key')
                    .setDescription('The access_key for the game.')
                    .setRequired(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName('delete')
            .setDescription('Delete a game.')
            .addStringOption(option => 
                option.setName('game-id')
                    .setDescription('The game we want to delete.')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addStringOption(option => 
                option.setName('access-key')
                    .setDescription('The access_key for the game.')
                    .setRequired(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
            .setName('dataframes')
            .setDescription('Get the dataframes of a game.')
            .addStringOption(option => 
                option.setName('game-id')
                    .setDescription('The game we want to add a dataframe to.')
                    .setRequired(true)
                    .setAutocomplete(true)
            ))
        .addSubcommand(subcommand =>
            subcommand
                .setName('create-dataframe')
                .setDescription('Create a dataframe for a game.')
                .addStringOption(option => 
                    option.setName('game-id')
                        .setDescription('The game we want to add a dataframe to.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
                .addStringOption(option => 
                    option.setName('access-key')
                        .setDescription('The access_key for the game.')
                        .setRequired(true)
                ))
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
    },
    async autocomplete(interaction) {
        const command = interaction.options.getSubcommand();
        const subcommandPath = path.join(__dirname, `subcommands/${command}.js`);
        const { autocomplete } = require(subcommandPath);

        if (autocomplete) {
            const choices = await autocomplete(interaction);
            await interaction.respond(choices);
        } else {
            console.log(`[WARNING] The subcommand ${command} is missing or the associated execute value function is missing.`)
            await interaction.respond([]);
        }
    }
}