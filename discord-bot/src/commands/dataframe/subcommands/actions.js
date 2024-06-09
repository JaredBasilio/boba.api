const { AttachmentBuilder } = require('discord.js');
const {generateFileName} = require('../../../utils/convertTime')

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const caller = interaction.user.tag;

        const dataframe_id = interaction.options.getString('dataframe-id');

        const response = await fetch(`https://bobaapi.up.railway.app/api/dataframes/${dataframe_id}/actions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const json = await response.json();

        if (!json.length) {
            interaction.reply('No Actions Found!');
        }

        const jsonString = JSON.stringify(json, null, 2);


        const filePath = generateFileName(caller, dataframe_id)

        const buffer = Buffer.from(jsonString, 'utf8');

        const file = new AttachmentBuilder(buffer, { name: filePath} );

        interaction.editReply({content: `Actions for dataframe: \`${dataframe_id}\``, files: [file]})
    }
}