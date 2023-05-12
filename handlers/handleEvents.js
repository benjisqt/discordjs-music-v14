const fs = require('fs');

async function handleEvents(client) {
    const files = fs.readdirSync(`./events`).filter((file) => file.endsWith(".js"));

    for (const file of files) {
        const event = require(`../events/${file}`);

        if(event.rest) {
            if(event.once) client.rest.once(event.name, (...args) => event.execute(...args, client));
            else client.rest.on(event.name, (...args) => event.execute(...args, client));
        } else {
            if(event.once) client.once(event.name, (...args) => event.execute(...args, client));
            else client.on(event.name, (...args) => event.execute(...args, client));
        }
        continue;
    }

    return console.log('Events Loaded!');
}

module.exports = { handleEvents };