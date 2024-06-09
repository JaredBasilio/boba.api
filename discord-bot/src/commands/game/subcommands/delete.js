const { deleteModal } = require('../../../utils/modals/deleteModal');

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
            deleteModal(interaction, 'game');

            const filter = (interaction) => interaction.customId === 'delete-game';

            interaction
                .awaitModalSubmit({filter, time: 30_000})
                .then(async (modalInteraction) => {
                    await modalInteraction.deferReply();
                    const confirmPhrase = modalInteraction.fields.getTextInputValue('deleteInput');

                    if (confirmPhrase === `DELETE GAME`) {
                        try {
                            const response = await fetch(`https://bobaapi.up.railway.app/api/games/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    access_key
                                })
                            })

                            if (!response.ok) {
                                throw response;
                            }

                            const json = await response.json();

                            modalInteraction.editReply({
                                content:`Deleted Game ${id}`,
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
                    } else {
                        modalInteraction.reply({
                            content: `Confirm Phrase Incorrect`,
                            ephemeral: true
                        })
                    }
                })
                .catch((err) => {
                    console.log(`Error: ${err}`)
                })
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