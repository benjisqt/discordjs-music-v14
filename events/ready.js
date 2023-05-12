const { Client, ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',

    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        client.user.setActivity({
            name: 'all kinds of songs!',
            type: ActivityType.Listening
        });

        console.log('Client Loaded!');
    }
}