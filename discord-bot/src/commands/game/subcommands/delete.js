const { deleteModal } = require('../../../utils/modals/deleteModal');
const { request } = require('undici');

module.exports = {
    async execute(interaction) {
        const id = interaction.options.getString('game-id');
        const accessKey = interaction.options.getString('access-key');

        const accessResponse = await request(`https://bobaapi.up.railway.app/api/games/${id}/check-access`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey
            })
        });

        const accessJson = await accessResponse.body.json();

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

                    if (confirmPhrase === `delete game`) {
                        const response = await request(`https://bobaapi.up.railway.app/api/games/${id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                access_key: accessKey
                            })
                        })

                        const json = await response.body.json();

                        modalInteraction.editReply({
                            content:`Deleted Game ${id}`,
                            ephemeral: true
                        })
                    } else {
                        modalInteraction.reply({
                            content: `Confirm Phrase incorrect`,
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
        const option = interaction.options.getFocused(true).name;
        if (option === 'game-id') {
            const response = await request('https://bobaapi.up.railway.app/api/games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const json = await response.body.json();

            return json.map((game) => ({
                name: game.name,
                value: game._id
            }))
        }
        return [];
    }
}