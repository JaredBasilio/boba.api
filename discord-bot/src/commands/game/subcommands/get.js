const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const id = interaction.options.getString('game-id');

        const response = await request(`https://bobaapi.up.railway.app/api/games/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })

        const json = await response.body.json();

        let reply = ''
        reply += `Id: ${json._id}\n`
        reply += `Name: ${json.name}\n`
        reply += `Description: ${json?.description || ''}\n`
        reply += `Author: ${json.author}\n`
        reply += `Created At: ${formatReadableDateTime(json.createdAt)}\n`
        reply += `Updated At: ${formatReadableDateTime(json.updatedAt)}\n`
        
        interaction.editReply(`\`\`\`\n${reply}\n\`\`\``);
    },
    async autocomplete(interaction) {
        const option = interaction.options.getFocused(true).name;
        if (option === 'game-id') {
            const response = await request('https://bobaapi.up.railway.app/api/games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const json = await response.body.json();

            return json.map((game) => ({
                name: game.name,
                value: game._id
            }))
        }
        return [];
    }
}