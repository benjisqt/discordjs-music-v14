const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const player = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('See the status of the song playing!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction, client) {
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

        const song = queue.songs[0];

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Now Playing`)
                .setDescription(`> I'm playing **${song.name}**!\n> This song was requested by \`${song.user.tag}\`\n\nDuration: \`${song.formattedDuration}\``)
                .setColor('Aqua')
                .setThumbnail(song.thumbnail || "")
            ]
        });
    }
}