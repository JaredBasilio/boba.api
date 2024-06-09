const { inputModal } = require('../../../utils/modals/inputModal');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;
        inputModal(interaction, 'game');
        
        const filter = (interaction) => interaction.customId === `create-game`
        
        interaction.awaitModalSubmit({ filter, time: 30_000 })
            .then(async (modalInteraction) => {
                await modalInteraction.deferReply();
                const name = modalInteraction.fields.getTextInputValue('nameInput');
                const description = modalInteraction.fields.getTextInputValue('descriptionInput');

                try {
                    const response = await fetch('https://bobaapi.up.railway.app/api/games', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name,
                            author: user,
                            description
                        })
                    });

                    if (!response.ok) {
                        throw response;
                    }

                    const json = await response.json();

                    let gameCreationMessage = `Game Creation Successful! Your access_key is ${json.access_key}.\n\n`;
                    gameCreationMessage += 'Below are the details to your game:\n';
                    gameCreationMessage += `- ID: ${json._id}\n`;
                    gameCreationMessage += `- Name: ${json.name}\n`;
                    gameCreationMessage += `- Author ${json.author} (This is your profile_id)\n`
                    gameCreationMessage += json.description ? `- Description: ${json.description}\n` : '';
                    gameCreationMessage += `- Created At: ${formatReadableDateTime(json.createdAt)}\n`;
                    gameCreationMessage += `- Updated At: ${formatReadableDateTime(json.updatedAt)}\n`;

                    await modalInteraction.editReply({
                        content: `\`\`\`${gameCreationMessage}\`\`\``,
                        ephemeral: true
                    });
                } catch (error) {
                    if (error instanceof Error) {
                        await modalInteraction.editReply({
                            content: error.toString(),
                            ephemeral: true
                        })
                        return;
                    }
                    error.json().then(async (responseJson) => {                       
                        await modalInteraction.editReply({
                            content: `Error: ${responseJson.msg}`,
                            ephemeral: true
                        });
                    })
                }
            })
            .catch((err) => {
                console.error('Modal submission error:', err);
            });
    }
}