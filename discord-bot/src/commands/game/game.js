const { ApplicationCommandType } = require("discord.js")

module.exports = {
    name: 'game',
    description: 'Game functions.',
    options: [
        {
            name: 'create',
            description: 'create',
            type: ApplicationCommandType.User,
        }
    ],
    callback: (client, interaction) => {

    }
}