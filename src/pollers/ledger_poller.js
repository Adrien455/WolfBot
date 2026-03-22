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

        if(!ledger) 
        {
            console.log("Unexpected null / undefined ledger");
            await sleep(2000);
            continue;
        }

        for(let i = ledger.length - 1; i >= 0; i--)
        {
            const transaction = ledger[i];

            if(!transaction)
            {
                console.log("Unexpected null / undefined transaction");
                continue;
            }

            const transaction_date = new Date(transaction.creationTime);

            if (transaction_date > last_seen_date)
            {
                await ledger_handler(transaction);
            }
        }

        await sleep(2000);
    }
}

module.exports = ledger_poller;