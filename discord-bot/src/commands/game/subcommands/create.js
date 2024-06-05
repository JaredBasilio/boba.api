const { createModal } = require('../../../utils/modals/createModal');
const { request } = require('undici');

module.exports = {
    async execute(interaction) {
        const user = interaction.user.id;
        createModal(interaction, 'game');
        
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
                        content: `Creating Game`,
                        ephemeral: true
                    })
                }
            
                modalInteraction.editReply({
                    content:`
                        Game Creation Successful! Your access_key is \`${json.access_key}\`.\nBelow are the details to your game:\nid: \`${json._id}\`\nname: \`${json.name}\`\nauthor: \`${json.author}\` (This is your profile_id)\ndescription: \`${json.description}\`\ncreated_at: \`${json.createdAt}\`\nupdated_at \`${json.updatedAt}\`\n`,
                    ephemeral: true
                })
            })
            .catch((err) => {
                console.log(`Error: ${err}`)
            });
    }
}

// .then(({response, modalInteraction}) => {
//     console.log(response);
//     const {
//         _id,
//         name,
//         author,
//         description,
//         access_key,
//         createdAt,
//         updatedAt
//      } = response;

//     modalInteraction.reply({
//         content:`
//             Game Creation Successful! Your access_key is \`${access_key}\`.
//             Below are the details to your game:
//             id: \`${_id}\`
//             name: \`${name}\`
//             author: \`${author}\` (This is your profile_id)
//             description: \`${description}\`
//             created_at: \`${createdAt}\`
//             updated_at \`${updatedAt}\``,
//         ephemeral: true
//     })
// })