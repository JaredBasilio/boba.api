const { ActionRowBuilder, ModalBuilder } = require('discord.js');
const {modalInputShort} = require('../inputs/modalInputShort');
const {modalInputLong} = require('../inputs/modalInputLong'); 

module.exports = {
    async createModal(interaction, data, hasSchema = false, access_key=false) {
        const modal = new ModalBuilder()
            .setCustomId(`create-${data}`)
            .setTitle(`Create ${data.charAt(0).toUpperCase() + data.slice(1)}`);

        const fields = [];
        fields.push(new ActionRowBuilder().addComponents(modalInputShort('name', data).setRequired(true)));
        fields.push(new ActionRowBuilder().addComponents(modalInputLong('description', data)));
        if(schema) fields.push(new ActionRowBuilder().addComponents(modalInputShort('schema', data).setRequired(true)));
        if (access_key) fields.push(new ActionRowBuilder().addComponents(modalInputShort('accessKey', data).setRequired(true)));

        interaction.addComponents(...fields);


        await interaction.showModal(modal);
    }
}