const { inputModal } = require('../../../utils/modals/inputModal');
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
            inputModal(interaction, 'game', {update: true});
            
            const filter = (interaction) => interaction.customId === `update-game`

            interaction
                .awaitModalSubmit({filter, time: 30_000})
                .then(async (modalInteraction) => {
                    await modalInteraction.deferReply();
                    const name = modalInteraction.fields.getTextInputValue('nameInput');
                    const description = modalInteraction.fields.getTextInputValue('descriptionInput');

                    const response = await request(`https://bobaapi.up.railway.app/api/games/${id}`, {
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

                    const json = await response.body.json();

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
                })
                .catch((err) => {
                    console.log(`Error: ${err}`)
                });
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