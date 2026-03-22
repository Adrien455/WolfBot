const sleep = require('../utils');
const ledger_handler = require('../handlers/ledger_handler');
const { get } = require('../api/requests');
const { CLAN_ID } = require('../config');

async function ledger_poller(starting_date)
{
    let last_seen_date = starting_date;

    while(1)
    {
        const ledger = await get(`clans/${CLAN_ID}/ledger`);

        if(!ledger || ledger.length == 0)   // very unlikely
        {
            await sleep(2000);
            continue;
        }

        for(let i = ledger.length - 1; i >= 0; i--)
        {
            const transaction = ledger[i];
            const transaction_date = new Date(transaction.creationTime);

            if (transaction_date > last_seen_date)
            {
                last_seen_date = transaction_date;
                await ledger_handler(transaction);
            }
        }

        await sleep(2000);
    }
}

module.exports = ledger_poller;