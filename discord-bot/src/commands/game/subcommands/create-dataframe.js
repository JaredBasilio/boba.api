const { createModal } = require('../../../utils/modals/createModal');
const { formatReadableDateTime } = require('../../../utils/convertTime');
const { request } = require('undici');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;

        const id = interaction.options.getString('game-id');
        const accessKey = interaction.options.getString('access-key');

        createModal(interaction, 'dataframe', schema=true);
        
        const filter = (interaction) => interaction.customId === `create-dataframe`

        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then(async (modalInteraction) => {
                await modalInteraction.deferReply();

                const name = modalInteraction.fields.getTextInputValue('nameInput');
                const description = modalInteraction.fields.getTextInputValue('descriptionInput');
                const schema =  modalInteraction.fields.getTextInputValue('schemaInput');
                const formattedSchema = schema.split(',').map(item => item.trim());

                // validates and uploads dataframe
                const response = await request(`https://bobaapi.up.railway.app/api/games/${id}/dataframes`, {
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

                const json = await response.body.json();

                if (!json) {
                    modalInteraction.reply({
                        content: `There was an issue creating your dataframe.`,
                    })
                }

                modalInteraction.editReply({
                    content:`
                        Dataframe Creation Successful! Below are the details to your game:\nid: \`${json._id}\`\nname: \`${json.name}\`\nauthor: \`${json.author}\` (This is your profile_id)\ndescription: \`${json.description}\`\nschema: \`${formattedSchema}\`\ngame_id: \`${json.game_id}\`\ncreated_at: \`${formatReadableDateTime(json.createdAt)}\`\nupdated_at \`${formatReadableDateTime(json.updatedAt)}\`\n`,
                })            
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            });
    }
}