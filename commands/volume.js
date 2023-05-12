const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const player = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust the volume!')
    .addNumberOption((opt) =>
        opt.setName('volume')
        .setDescription('The volume of the player!')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const { options, member, guild, channel } = interaction;
        const volume = interaction.options.getNumber('volume');

        const query = options.getString('query');
        const vc = member.voice.channel;

        if(!vc) return interaction.reply({
            content: `You are not in a voice channel.`
        });

        if(!member.voice.channelId == guild.members.me.voice.channel) {
            return interaction.reply({
                content: `The music player is already active in <#${guild.members.me.voice.channelId}>`
            });
        }

        const queue = player.getQueue(guild);

        if(!queue) {
            return interaction.reply({
                content: `There is no queue!`
            });
        }

        queue.setVolume(volume);
        return interaction.reply({ content: `Changed volume to ${volume}%` });
    }
}