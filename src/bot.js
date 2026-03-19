const sleep = require('./utils');
const command_handler = require('./event_handler');
const { getLastMessage } = require('./message');

async function run_bot()
{
    let last_seen = null;

    while(1)
    {
        const last_message = await getLastMessage();
        console.log(last_message);

        if (last_message && last_message !== last_seen)
        {
            last_seen = last_message;

            if (last_message.startsWith("!"))
            {
                await command_handler(last_message.slice(1));
            }
        }

        await sleep(5000);     
    }
}

module.exports = run_bot;