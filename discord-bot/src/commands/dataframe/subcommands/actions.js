const { AttachmentBuilder } = require('discord.js');
const { request } = require('undici');
const {generateFileName} = require('../../../utils/convertTime')
const fs = require('fs');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const caller = interaction.user.tag;

        const dataframe_id = interaction.options.getString('dataframe-id');

        const response = await request(`https://bobaapi.up.railway.app/api/dataframes/${dataframe_id}/actions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const json = await response.body.json();
        const jsonString = JSON.stringify(json, null, 2);

        const filePath = generateFileName(caller, dataframe_id)

        fs.writeFileSync(filePath, jsonString, 'utf8');

        const file = new AttachmentBuilder(filePath);
        interaction.editReply({content: `Here are the actions for dataframe: \`${dataframe_id}\``, files: [file]})

        // if (!json.length) {
        //     interaction.reply('No Actions Found!');
        // }
    }
}