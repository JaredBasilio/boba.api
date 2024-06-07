const { ActionRowBuilder, ModalBuilder } = require('discord.js');
const {modalInputShort} = require('../inputs/modalInputShort');
const {modalInputLong} = require('../inputs/modalInputLong'); 

module.exports = {
    async inputModal(interaction, data, options = {}) {
        const { schema = false, update = false } = options
        const method = update ? 'update' : 'create';
        const modal = new ModalBuilder()
            .setCustomId(`${method}-${data}`)
            .setTitle(`${method.charAt(0).toUpperCase() + method.slice(1)} ${data.charAt(0).toUpperCase() + data.slice(1)}`);
        
        const fields = [];
        fields.push(new ActionRowBuilder().addComponents(modalInputShort('name', data).setRequired(!update)));
        fields.push(new ActionRowBuilder().addComponents(modalInputLong('description', data).setRequired(false)));
        if (schema) fields.push(new ActionRowBuilder().addComponents(modalInputShort('schema', data).setRequired(!update)));

        modal.addComponents(...fields);

        await interaction.showModal(modal);
    }
}