const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const authorId = interaction.options.getUser('author').id;

        const response = await request(`https://bobaapi.up.railway.app/api/dataframes?author=${authorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })

        const json = await response.body.json();

        console.log(json);
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