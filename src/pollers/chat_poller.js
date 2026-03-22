const sleep = require('../utils');
const command_handler = require('../handlers/command_handler');
const { get_last_messages } = require('../api/message');

async function chat_poller(starting_date)
{
    let last_seen_date = starting_date;

    while(1)
    {
        const messages = await get_last_messages();

        if(!messages || messages.length == 0) 
        {
            console.log("Unexpected null / undefined messages");
            await sleep(2000);
            continue;
        }

        for(let i = messages.length - 1; i >= 0; i--)
        {
            const message = messages[i];

            if(!message)
            {
                console.log("Unexpected null / undefined message");
                continue;
            }

            const msg_date = new Date(message.date);

            if (msg_date > last_seen_date)
            {
                last_seen_date = msg_date;
                
                if (message.msg.startsWith("!"))
                {
                    await command_handler(message);
                }
            }
        }

        await sleep(2000);
    }
}

module.exports = chat_poller;