const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require('discord.js');
const player = require('../index');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song using various options!')
    .addStringOption((opt) =>
        opt.setName('query')
        .setDescription('The URL or name of the song!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
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

        player.play(vc, query, { textChannel: channel, member: member });
        return interaction.reply({ content: `Request received. 🎶` });
    }
}