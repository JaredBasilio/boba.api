const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const game_id = interaction.options.getUser('game-id').id;

        const response = await request(`https://bobaapi.up.railway.app/api/games/${game_id}/dataframes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })

        const json = await response.body.json();
        if (!json.length) {
            interaction.reply('No Dataframes Found!');
        }

        const reply = json.map((dataframe) => {
            let dataframe_string = '';
            dataframe_string += `ID: ${dataframe._id}\n`
            dataframe_string += `Name: ${dataframe.name}\n`
            dataframe_string += `Description: ${dataframe?.description || ''}\n`
            dataframe_string += `Author: ${dataframe.author}\n`
            dataframe_string += `Schema ${dataframe.schema.join()}\n`
            dataframe_string += `Game ID: ${dataframe.game_id}\n`
            dataframe_string += `Created At: ${formatReadableDateTime(dataframe.createdAt)}\n`
            dataframe_string += `Updated At: ${formatReadableDateTime(dataframe.updatedAt)}\n`
            return dataframe_string;
        }).join(`====\n`);
        
        let i = 0;
        interaction.editReply(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        i += 1950;
        for (; i < reply.length; i += 1950) {
            interaction.followUp(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        }
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