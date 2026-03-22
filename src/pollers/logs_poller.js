const sleep = require('../utils');
const log_handler = require('../handlers/log_handler');
const { get } = require('../api/requests');
const { CLAN_ID } = require('../config');

async function logs_poller(starting_date)
{
    let last_seen_date = starting_date;

    while(1)
    {
        const logs = await get(`clans/${CLAN_ID}/logs`);

        if(!logs) 
        {
            console.log("Unexpected null / undefined logs");
            await sleep(2000);
            continue;
        }

        for(let i = logs.length - 1; i >= 0; i--)
        {
            const log = logs[i];

            if(!log)
            {
                console.log("Unexpected null / undefined log");
                continue;
            }

            const log_date = new Date(log.creationTime);

            if (log_date > last_seen_date)
            {
                await log_handler(log);
            }
        }

        await sleep(2000);
    }
}

module.exports = logs_poller;