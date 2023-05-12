const { Collection, Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

const { Guilds, GuildMessages, GuildMembers, DirectMessages, GuildModeration, GuildInvites, GuildVoiceStates, GuildPresences, GuildWebhooks } = GatewayIntentBits;
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.config = require('./config.json');
client.commands = new Collection();
const { handleCommands } = require('./handlers/handleCommands');
const { handleEvents } = require('./handlers/handleEvents');

// music section
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const player = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    leaveOnEmpty: true,
    emitAddSongWhenCreatingQueue: true,
    plugins: [
        new SpotifyPlugin()
    ]
});

console.log('DisTube Initialised!');

module.exports = player;

// distube events
const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
player
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `✅ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `✅ | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`❌ | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))

// client login
client.login(client.config.token).then(async () => {
    handleCommands(client);
    handleEvents(client);
}).catch(err => {
    console.log(`An error occured starting up the client:\n${err}`)
})