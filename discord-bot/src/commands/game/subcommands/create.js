const { inputModal } = require('../../../utils/modals/inputModal');
const { request } = require('undici');
const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;
        inputModal(interaction, 'game');
        
        const filter = (interaction) => interaction.customId === `create-game`
        
        interaction
            .awaitModalSubmit({filter, time: 30_000})
            .then(async (modalInteraction) => {
                await modalInteraction.deferReply();
                const name = modalInteraction.fields.getTextInputValue('nameInput');
                const description = modalInteraction.fields.getTextInputValue('descriptionInput');

                const response = await request('https://bobaapi.up.railway.app/api/games', {
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

                const json = await response.body.json();

                if (!json) {
                    modalInteraction.reply({
                        content: `There was an issue creating your game.`,
                        ephemeral: true
                    })
                }
            
                modalInteraction.editReply({
                    content:`
                        Game Creation Successful! Your access_key is \`${json.access_key}\`.\nBelow are the details to your game:\nid: \`${json._id}\`\nname: \`${json.name}\`\nauthor: \`${json.author}\` (This is your profile_id)\ndescription: \`${json.description || ''}\`\ncreated_at: \`${formatReadableDateTime(json.createdAt)}\`\nupdated_at \`${formatReadableDateTime(json.updatedAt)}\`\n`,
                    ephemeral: true
                })
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            });
    }
}