module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const dataframe_id = interaction.options.getString('dataframe-id');

        const response = await fetch(`https://bobaapi.up.railway.app/api/dataframes/${dataframe_id}/sessions`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })

        const json = await response.json();

        if (!json.length) {
            InteractionResponse.reply('No Sessions Found!');
        }

        const reply = json.map((session) => {
            let session_string = '';
            session_string += `ID: ${session._id}\n`
            session_string += `Player: ${session.player}\n`
            session_string += `Dataframe ID: ${session?.dataframe_id}\n`
            session_string += `Created At: ${formatReadableDateTime(session.createdAt)}\n`
            session_string += `Updated At: ${formatReadableDateTime(session.updatedAt)}\n`
            return session_string;
        }).join(`====\n`);

        
        let i = 0;
        interaction.editReply(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        i += 1950;
        for (; i < reply.length; i += 1950) {
            interaction.followUp(`\`\`\`\n${reply.slice(i,i + 1950)}\n\`\`\``);
        }
    }
}