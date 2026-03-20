const sleep = require('./utils');
const command_handler = require('./event_handler');
const { getLastMessages } = require('./message');

async function run_bot()
{
    let last_seen_date = new Date();

    while(1)
    {
        const messages = await getLastMessages();

        for(let i = 29; i >= 0; i--)
        {
            const message = messages[i];
            const msg_date = new Date(message.date);

            if (msg_date > last_seen_date)
            {
                last_seen_date = msg_date;
                
                if (message.msg.startsWith("!"))
                {
                    await command_handler(message.msg.slice(1));
                }
            }
        }

        await sleep(2000);
    }
}

module.exports = run_bot;