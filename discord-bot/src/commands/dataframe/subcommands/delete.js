module.exports = {
    async execute(interaction) {
        await interaction.deferReply();
        const dataframe_id = interaction.options.getString('dataframe-id');
        const access_key = interaction.options.getString('access-key');

        const json = await response.body.json();
    }
}