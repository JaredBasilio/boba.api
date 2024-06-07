const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const authorId = interaction.options.getUser('author').id;

        const response = await request(`https://bobaapi.up.railway.app/api/games?author=${authorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const json = await response.body.json();
        if (!json.length) {
            interaction.reply('No Games Found!');
        }

        const reply = json.map((game) => {
            let game_string = '';
            game_string += `Id: ${game._id}\n`
            game_string += `Name: ${game.name}\n`
            game_string += `Description: ${game?.description || ''}\n`
            game_string += `Author: ${game.author}\n`
            game_string += `Created At: ${formatReadableDateTime(game.createdAt)}\n`
            game_string += `Updated At: ${formatReadableDateTime(game.updatedAt)}\n`
            return game_string;
        }).join(`====\n`);
        
        let i = 0;
        interaction.editReply(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        i += 1950;
        for (; i < reply.length; i += 1950) {
            interaction.followUp(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        }
    }
}