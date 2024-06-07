const { ActionRowBuilder, ModalBuilder } = require('discord.js');
const { confirmInput } = require('../inputs/confirmInput');

module.exports = {
    async deleteModal(interaction, data) {
        const modal = new ModalBuilder()
            .setCustomId(`delete-${data}`)
            .setTitle(`Delete ${data.charAt(0).toUpperCase() + data.slice(1)}`);
        
        const fields = [];

        fields.push(new ActionRowBuilder().addComponents(confirmInput('delete', data).setRequired(true)));

        modal.addComponents(...fields);

        await interaction.showModal(modal);
    }
}