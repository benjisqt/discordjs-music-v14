const fs = require('fs');

async function handleCommands(client) {
    const commandsArray = [];

    const files = fs.readdirSync(`./commands`).filter((file) => file.endsWith(".js"));

    for (const file of files) {
        const cmd = require(`../commands/${file}`);

        client.commands.set(cmd.data.name, cmd);

        commandsArray.push(cmd.data.toJSON());

        continue;
    }

    client.application.commands.set(commandsArray);

    return console.log('Commands Loaded!');
}

module.exports = { handleCommands };