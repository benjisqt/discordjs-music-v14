const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const player = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('Skip to a specific song in the queue!')
    .addNumberOption((opt) =>
        opt.setName('songnumber')
        .setDescription('The number of the song to jump to!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
        const son = interaction.options.getNumber('songnumber');
        const { options, member, guild, channel } = interaction;

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

        if(son > queue.songs.length) return interaction.reply({
            content: `There is not that many songs in the queue.`
        });

        const song = await player.jump(guild, son);
        return interaction.reply({ content: `Song jumped! Now playing ${song.name}` });
    }
}