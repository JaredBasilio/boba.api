const { createModal } = require('../../../utils/modals/createModal');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;
        createModal(interaction, 'game');
        
        const filter = (interaction) => interaction.customId === `create-game`
        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then(async (modalInteraction) => {
                const name = modalInteraction.fields.getTextInputValue('nameInput');
                const description = modalInteraction.fields.getTextInputValue('descriptionInput');

                const response = await fetch('https://bobaapi.up.railway.app/api/games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        author: user,
                        description: description,
                    })
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return { response: response.json(), modalInteraction }
            })
            .then(({response, modalInteraction}) => {
                const {
                    name,
                    author,
                    description,
                    access_key,
                    created_at,
                    updated_at
                 } = response;

                modalInteraction.reply({
                    content:`
                        Game Creation Successful! Your access_key is \`${access_key}\`.\n
                        Below are the details to your game:\n
                        name: \`${name}\`\n
                        author: \`${author}\` (This is your profile_id)\n
                        description: \`${description}\`\n
                        created_at: \`${created_at}\`\n
                        updated_at \`${updated_at}\`\n`,
                    ephemeral: true
                })
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            });
    }
}