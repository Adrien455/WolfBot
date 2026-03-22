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

        if(!logs || logs.length == 0)   // very unlikely
        {
            await sleep(2000);
            continue;
        }

        for(let i = logs.length - 1; i >= 0; i--)
        {
            const log = logs[i];
            const log_date = new Date(log.creationTime);

            if (log_date > last_seen_date)
            {
                last_seen_date = log_date;
                await log_handler(log);
            }
        }

        await sleep(2000);
    }
}

module.exports = logs_poller;