const { get } = require('./api/requests');
const { get_last_messages } = require('./api/message');

const { CLAN_ID } = require('./config');

const command_handler = require('./handlers/command_handler');
const log_handler =  require('./handlers/log_handler');
const ledger_handler =  require('./handlers/ledger_handler');

const { get_running } = require('./controller');
const sleep = require('./utils/sleep');

const PREFIX = "!";

function create_poller({fetch, get_date, handler, filter = () => true})
{
    return async function(starting_date, _delay)
    {
        let last_seen_date = starting_date;
        let delay = _delay;

        while(get_running())
        {
            const events = await fetch();
            let activity = false;

            if(!events || events.length == 0)   // very unlikely
            {
                await sleep(delay);
                continue;
            }

            for(let i = events.length - 1; i >= 0; i--)
            {
                const event = events[i];
                const event_date = new Date(get_date(event));

                if (event_date > last_seen_date)
                {
                    activity = true;
                    last_seen_date = event_date;

                    if(filter(event))
                    {
                        await handler(event);
                    }
                }
            }

            if(!activity)
            {
                delay = Math.min(delay + 300, 5000);
            }

            await sleep(delay);
        }
    }
}

const messages_poller = create_poller({
    fetch: get_last_messages,
    get_date: (event) => event.date,
    handler: command_handler,
    filter: (event) => event.msg.startsWith(PREFIX)
});

const logs_poller = create_poller({
    fetch: () => get(`clans/${CLAN_ID}/logs`),
    get_date: (event) => event.creationTime,
    handler: log_handler
});

const ledger_poller = create_poller({
    fetch: () => get(`clans/${CLAN_ID}/ledger`),
    get_date: (event) => event.creationTime,
    handler: ledger_handler
});

async function run_pollers(starting_date)
{
    messages_poller(starting_date, 2000);
    logs_poller(starting_date, 2000);
    ledger_poller(starting_date, 2000);
}

module.exports = run_pollers;