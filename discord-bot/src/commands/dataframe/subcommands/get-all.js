const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const game_id = interaction.options.getString('game-id');

        let url;
        if (!game_id) {
            url = 'https://bobaapi.up.railway.app/api/dataframes'
        } else {
            url = `https://bobaapi.up.railway.app/api/games/${game_id}/dataframes`
        }

        const response = await request(url, {
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
            dataframe_string += `**ID**: ${dataframe._id}\n`
            dataframe_string += `**Name**: ${dataframe.name}\n`
            dataframe_string += `**Description**: ${dataframe?.description || ''}\n`
            dataframe_string += `**Author**: ${dataframe.author}\n`
            dataframe_string += `**Schema** ${dataframe.schema.join()}\n`
            dataframe_string += `**Game ID**: ${dataframe.game_id}\n`
            dataframe_string += `**Created At**: ${formatReadableDateTime(dataframe.createdAt)}\n`
            dataframe_string += `**Updated At**: ${formatReadableDateTime(dataframe.updatedAt)}\n`
            return dataframe_string;
        }).join(`====\n`);

        
        let i = 0;
        interaction.editReply(reply.slice(i,i + 2000));
        i += 2000;
        for (; i < reply.length; i += 2000) {
            interaction.followUp(reply.slice(i,i + 2000));
        }
    }
}