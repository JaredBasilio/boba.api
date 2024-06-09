const { formatReadableDateTime } = require('../../../utils/convertTime');

module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const game_id = interaction.options.getString('game-id').id;

        try {
            const response = await fetch(`https://bobaapi.up.railway.app/api/games/${game_id}/dataframes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
            })
            
            if (!response.ok) {
                throw response;
            }
            
            const json = await response.json();

            const reply = json.map((dataframe) => {
                let dataframe_string = '';
                dataframe_string += `ID: ${dataframe._id}\n`
                dataframe_string += `Name: ${dataframe.name}\n`
                dataframe_string += `Description: ${dataframe?.description || ''}\n`
                dataframe_string += `Author: ${dataframe.author}\n`
                dataframe_string += `Schema ${dataframe.schema.join()}\n`
                dataframe_string += `Game ID: ${dataframe.game_id}\n`
                dataframe_string += `Created At: ${formatReadableDateTime(dataframe.createdAt)}\n`
                dataframe_string += `Updated At: ${formatReadableDateTime(dataframe.updatedAt)}\n`
                return dataframe_string;
            }).join(`====\n`);
            
            let i = 0;
            interaction.editReply(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
            i += 1950;
            for (; i < reply.length; i += 1950) {
                interaction.followUp(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
            }
        } catch (error) {
            if (error instanceof Error) {
                await interaction.editReply({
                    content: error.toString(),
                    ephemeral: true
                })
                return;
            }
            error.json().then(async (responseJson) => {                       
                await interaction.editReply({
                    content: `Error: ${responseJson.error}`,
                    ephemeral: true
                });
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