const { ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        if(!interaction.isChatInputCommand()) return;
        if(interaction.user.bot) return;

        const command = client.commands.get(interaction.commandName);

        if(!command) return interaction.reply({
            content: `This command is either outdated or has been removed.`
        });
        
        command.execute(interaction, client);
    }
}