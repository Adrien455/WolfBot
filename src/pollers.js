const { get } = require('./api/requests');
const { get_last_messages, send_message } = require('./api/message');

const command_handler = require('./handlers/command_handler');
const log_handler =  require('./handlers/log_handler');
const ledger_handler =  require('./handlers/ledger_handler');

const sleep = require('./utils/sleep');

const PREFIX = "!";
const POLL_MAX_DELAY = 5000;
const POLL_MIN_DELAY = 500;

function create_poller({fetch, get_date, set_last, handler, filter = () => true})
{
    return async function(context, last_date, _delay)
    {
        let last_seen_date = last_date;
        let delay = _delay;

        while(context.running)
        {
            let events;

            try
            {
                events = await fetch(context);
            }
            catch(err)
            {
                console.log(err.message);
                await sleep(delay);
                continue;
            }

            let activity = false;

            for(let i = events.length - 1; i >= 0; i--)
            {
                const event = events[i];
                const event_date = new Date(get_date(event));

                if (event_date > last_seen_date)
                {
                    activity = true;
                    last_seen_date = event_date;    // safe here in case of network error retype command
                    set_last(context, event_date);

                    if(filter(event))
                    {
                        try
                        {
                            await handler(context, event);
                        }
                        catch(err)
                        {
                            console.log(err.message);

                            try
                            {
                                await send_message(context, err.message);
                            }
                            catch(err)
                            {
                                console.log(err.message);
                            }
                        }
                    }
                }
            }

            if(!activity)
            {
                delay = Math.min(delay + 300, POLL_MAX_DELAY);
            }
            else
            {
                delay = POLL_MIN_DELAY;
            }

            await sleep(delay);
        }
    }
}

const messages_poller = create_poller({
    fetch: get_last_messages,
    get_date: (event) => event.date,
    set_last: (date) => {},
    handler: command_handler,
    filter: (event) => event.msg.startsWith(PREFIX)
});

const logs_poller = create_poller({
    fetch: (context) => get(`clans/${context.id}/logs`),
    get_date: (event) => event.creationTime,
    set_last: (context, date) => context.state.last_log_date = date,
    handler: log_handler
});

const ledger_poller = create_poller({
    fetch: (context) => get(`clans/${context.id}/ledger`),
    get_date: (event) => event.creationTime,
    set_last: (context, date) => context.state.last_ledger_date = date,
    handler: ledger_handler
});

function run_pollers(context, starting_date)
{
    messages_poller(context, starting_date, POLL_MIN_DELAY);
    logs_poller(context, context.state.last_log_date, POLL_MIN_DELAY);
    ledger_poller(context, context.state.last_ledger_date, POLL_MIN_DELAY);
}

module.exports = run_pollers;