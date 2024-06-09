const { TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    confirmInput(fieldName, data) {
        return new TextInputBuilder()
            .setCustomId(`${fieldName}Input`)
            .setLabel(`To process deletion, please type delete ${data}.`)
			.setStyle(TextInputStyle.Short);
    }
}
