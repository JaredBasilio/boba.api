const { inputModal } = require('../../../utils/modals/inputModal');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;

        const id = interaction.options.getString('game-id');
        const accessKey = interaction.options.getString('access-key');

        const accessResponse = await fetch(`https://bobaapi.up.railway.app/api/games/${id}/check-access?access_key=${accessKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const accessJson = await accessResponse.json();

        if (!accessJson.hasAccess) {
            interaction.reply({
                content:`User does not have access to create dataframe for game \`${id}\``,
            })
        } else {
            inputModal(interaction, 'dataframe', {schema: true});
            
            const filter = (interaction) => interaction.customId === `create-dataframe`

            interaction
                .awaitModalSubmit({filter, time: 30_000})
                .then(async (modalInteraction) => {
                    await modalInteraction.deferReply();

                    const name = modalInteraction.fields.getTextInputValue('nameInput');
                    const description = modalInteraction.fields.getTextInputValue('descriptionInput');
                    const schema =  modalInteraction.fields.getTextInputValue('schemaInput');
                    const formattedSchema = schema.split(',').map(item => item.trim());

                    try {
                        // validates and uploads dataframe
                        const createResponse = await fetch(`https://bobaapi.up.railway.app/api/games/${id}/dataframes`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                name: name,
                                author: user,
                                description: description,
                                schema: formattedSchema,
                                access_key: accessKey
                            })
                        })

                        if (!createResponse.ok) {
                            throw createResponse;
                        }

                        const json = await createResponse.json();
                        
                        let dataframeCreationMessage = 'Dataframe Creation Successful!\n\nBelow are the details to your game:\n'
                        dataframeCreationMessage += `- ID: ${json._id}\n`;
                        dataframeCreationMessage += `- Name: ${json.name}\n`;
                        dataframeCreationMessage += `- Author ${json.author} (This is your profile_id)\n`
                        dataframeCreationMessage += json.description ? `- Description: ${json.description}\n` : '';
                        dataframeCreationMessage += `- Schema: ${formattedSchema}\n`
                        dataframeCreationMessage += `- Game ID: ${json.game_id}\n`
                        dataframeCreationMessage += `- Created At: ${formatReadableDateTime(json.createdAt)}\n`;
                        dataframeCreationMessage += `- Updated At: ${formatReadableDateTime(json.updatedAt)}\n`;

                        await modalInteraction.editReply({
                            content: `\`\`\`${dataframeCreationMessage}\`\`\``
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

            return json
                .map((game) => ({
                    name: game.name,
                    value: game._id
                    }))
                .filter((game) => game.name.startsWith(option.value))
        }
        return [];
    }
}