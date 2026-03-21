const sleep = require('./utils');
const command_handler = require('./command_handler');
const { getLastMessages } = require('./services/message');

async function run_bot()
{
    let last_seen_date = new Date();

    while(1)
    {
        const messages = await getLastMessages();

        if(!messages) 
        {
            console.log("Uneexpected null / undefined messages");
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

module.exports = run_bot;