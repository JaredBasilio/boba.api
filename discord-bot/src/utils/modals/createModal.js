const { ActionRowBuilder, ModalBuilder } = require('discord.js');
const {modalInputShort} = require('../inputs/modalInputShort');
const {modalInputLong} = require('../inputs/modalInputLong'); 

module.exports = {
    async createModal(interaction, data, schema = false) {
        const modal = new ModalBuilder()
            .setCustomId(`create-${data}`)
            .setTitle(`Create ${data.charAt(0).toUpperCase() + data.slice(1)}`);

        const name = new ActionRowBuilder().addComponents(modalInputShort('name', data).setRequired(true));
        const description = new ActionRowBuilder().addComponents(modalInputLong('description', data));

        modal.addComponents(name, description);

        await interaction.showModal(modal);
    }
}