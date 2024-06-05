const { createModal } = require('../../../utils/modals/createModal');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;

        // TODO Get The game id of the game we want to add a dataframe to
        const id = ''

        createModal(interaction, 'dataframe', schema=true, access_key=true);
        
        const filter = (interaction) => interaction.customId === `create-dataframe`
        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then(async (modalInteraction) => {
                const name = modalInteraction.fields.getTextInputValue('nameInput');
                const description = modalInteraction.fields.getTextInputValue('descriptionInput');
                const schema =  modalInteraction.fields.getTextInputValue('schemaInput');
                const access_key = modalInteraction.fields.getTextInputValue('accessKeyInput');
                const formattedSchema = schema.split(',').map(item => item.trim());

                // validates and uploads dataframe
                const response = await fetch(`https://bobaapi.up.railway.app/api/games/${id}/dataframes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        author: user,
                        description: description,
                        schema: formattedSchema,
                        access_key: access_key
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
                    schema,
                    createdAt,
                    updatedAt
                } = response;

                modalInteraction.reply({
                    content:`
                        Dataframe Creation Successful!.\n
                        Below are the details to your game:\n
                        id: \`${_id}\`\n
                        name: \`${name}\`\n
                        author: \`${author}\` (This is your profile_id)\n
                        schema: \`${schema.join()}\`\n
                        description: \`${description}\`\n
                        created_at: \`${createdAt}\`\n
                        updated_at \`${updatedAt}\`\n`,
                    ephemeral: true
                })
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            });
    }
}