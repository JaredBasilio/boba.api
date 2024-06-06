const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();

        const response = await request('https://bobaapi.up.railway.app/api/games', {
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
            game_string += `**Id**: ${game._id}\n`
            game_string += `**Name**: ${game.name}\n`
            game_string += `**Description**: ${game?.description || ''}\n`
            game_string += `**Author**: ${game.author}\n`
            game_string += `**Created At**: ${formatReadableDateTime(game.createdAt)}\n`
            game_string += `**Updated At**: ${formatReadableDateTime(game.updatedAt)}\n`
            game_string += `====\n`
            return game_string;
        }).join(`====\n`);
        
        let i = 0;
        interaction.editReply(reply.slice(i,i + 2000));
        i += 2000;
        for (; i < reply.length; i += 2000) {
            interaction.followUp(reply.slice(i,i + 2000));
        }
    }
}