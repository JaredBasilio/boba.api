const { TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    modalInputShort(fieldName, data) {
        return new TextInputBuilder()
            .setCustomId(`${fieldName}Input`)
            .setLabel(`What is the ${fieldName} of this ${data}?`)
			.setStyle(TextInputStyle.Short);
    }
}
