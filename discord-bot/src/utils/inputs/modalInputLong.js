const { TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    modalInputLong(fieldName, data) {
        return new TextInputBuilder()
            .setCustomId(`${fieldName}Input`)
            .setLabel(`What is the ${fieldName} of this ${data}?`)
			.setStyle(TextInputStyle.Paragraph);
    }
}
