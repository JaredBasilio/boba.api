const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const userId = interaction.options.getUser('user').id;

        const response = await request(`https://bobaapi.up.railway.app/api/games?author=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const json = await response.body.json();
        if (!json.length) {
            interaction.reply('No Games Found!');
        }

        let reply = '';
        for (const game of json) {
            reply += `**Id**: ${game._id}\n`
            reply += `**Name**: ${game.name}\n`
            reply += `**Description**: ${game?.description || ''}\n`
            reply += `**Author**: ${game.author}\n`
            reply += `**Created At**: ${formatReadableDateTime(game.createdAt)}\n`
            reply += `**Updated At**: ${formatReadableDateTime(game.updatedAt)}\n`
            reply += `====\n`
        }

        
        let i = 0;
        interaction.editReply(reply.slice(i,i + 2000));
        i += 2000;
        for (; i < reply.length; i += 2000) {
            interaction.followUp(reply.slice(i,i + 2000));
        }
    }
}