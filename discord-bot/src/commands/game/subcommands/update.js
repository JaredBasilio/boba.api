const { inputModal } = require('../../../utils/modals/inputModal');

module.exports = {
    async execute(interaction) {
        const id = interaction.options.getString('game-id');
        const access_key = interaction.options.getString('access-key');

        const accessResponse = await fetch(`https://bobaapi.up.railway.app/api/games/${id}/check-access?access_key=${access_key}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const accessJson = await accessResponse.json();

        if (!accessJson.hasAccess) {
            interaction.reply({
                content:`User does not have access to update game \`${id}\``,
            })
        } else {
            inputModal(interaction, 'game', {update: true});
            
            const filter = (interaction) => interaction.customId === `update-game`

            interaction
                .awaitModalSubmit({filter, time: 30_000})
                .then(async (modalInteraction) => {
                    await modalInteraction.deferReply();
                    const name = modalInteraction.fields.getTextInputValue('nameInput');
                    const description = modalInteraction.fields.getTextInputValue('descriptionInput');
                    
                    try {
                        const response = await fetch(`https://bobaapi.up.railway.app/api/games/${id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: name,
                                description: description,
                                access_key: accessKey
                            })
                        })

                        if (!response.ok) {
                            throw response;
                        }

                        const json = await response.json();

                        if (!json) {
                            modalInteraction.reply({
                                content: `There was an issue updating your game.`,
                                ephemeral: true
                            })
                        }
                    
                        modalInteraction.editReply({
                            content:`Game Update Successful!`,
                            ephemeral: true
                        })
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
                                content: `Error: ${responseJson.error}`,
                                ephemeral: true
                            });
                        })
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`)
                });
        }
    },
    async autocomplete(interaction) {
        const option = interaction.options.getFocused(true);
        if (option.name === 'game-id') {
            const response = await fetch('https://bobaapi.up.railway.app/api/games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const json = await response.json();

            return json.map((game) => ({
                name: game.name,
                value: game._id
            }))
            .filter((game) => game.name.startsWith(option.value))
        }
        return [];
    }
}