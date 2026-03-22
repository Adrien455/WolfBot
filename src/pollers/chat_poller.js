const sleep = require('../utils');
const command_handler = require('../handlers/command_handler');
const { get_last_messages } = require('../api/message');

const PREFIX = "!";

async function chat_poller(starting_date)
{
    let last_seen_date = starting_date;
    let delay = 1000;

    while(1)
    {
        const messages = await get_last_messages();

        if(!messages || messages.length == 0)   // very unlikely
        {
            await sleep(delay);
            continue;
        }

        for(let i = messages.length - 1; i >= 0; i--)
        {
            const message = messages[i];
            const msg_date = new Date(message.date);

            if (msg_date > last_seen_date)
            {
                last_seen_date = msg_date;
                
                if (message.msg.startsWith(PREFIX))
                {
                    await command_handler(message);
                }
            }
            else
            {
                delay = Math.min(delay + 300, 5000);
            }
        }

        await sleep(delay);
    }
}

module.exports = chat_poller;