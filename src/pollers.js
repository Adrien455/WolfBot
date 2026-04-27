const { get } = require('./api/requests');
const { get_last_messages, send_message } = require('./api/message');

const command_handler = require('./handlers/command_handler');
const log_handler =  require('./handlers/log_handler');
const ledger_handler =  require('./handlers/ledger_handler');

const sleep = require('./utils/sleep');

const PREFIX = "!";
const POLL_MAX_DELAY = 5000;
const POLL_MIN_DELAY = 500;

class Poller
{
    constructor({fetch, get_date, set_last, handler, filter = () => true})
    {
        this.fetch = fetch;
        this.get_date = get_date;
        this.set_last = set_last;
        this.handler = handler;
        this.filter = filter;
    }

    async run(context, last_date, _delay)
    {
        let last_seen_date = last_date;
        let delay = _delay;

        while(context.running)
        {
            let events;

            try
            {
                events = await this.fetch(context);
            }
            catch(err)
            {
                if(err.status === 401)
                {
                    throw err;  // means bot have been removed from this clan.
                }

                await sleep(delay);
                delay = Math.min(delay + 300, POLL_MAX_DELAY);
                continue;
            }

            let activity = false;

            for(let i = events.length - 1; i >= 0; i--)
            {
                const event = events[i];
                const event_date = new Date(this.get_date(event));

                if (event_date > last_seen_date)
                {
                    activity = true;
                    last_seen_date = event_date;    // safe here in case of network error retype command
                    this.set_last(context, event_date);

                    if(this.filter(event))
                    {
                        try
                        {
                            let response = await this.handler(context, event);

                            if(response)
                            {
                                await send_message(context, response);
                            }
                        }
                        catch(err)
                        {
                            if(err.log_message)
                            {
                                console.log(err.log_message);
                            }

                            if(err.message)
                            {        
                                await send_message(context, err.message)
                                    .catch(err => console.log(err.log_message ?? err.message));
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

const messages_poller = new Poller({
    fetch: get_last_messages,
    get_date: (event) => event.date,
    set_last: (context, date) => {},    // not needed. Only logs and ledger are backtracked
    handler: command_handler,
    filter: (event) => event.msg.startsWith(PREFIX)
});

const logs_poller = new Poller({
    fetch: (context) => get(`clans/${context.id}/logs`),
    get_date: (event) => event.creationTime,
    set_last: (context, date) => context.state.last_log_date = date,
    handler: log_handler
});

const ledger_poller = new Poller({
    fetch: (context) => get(`clans/${context.id}/ledger`),
    get_date: (event) => event.creationTime,
    set_last: (context, date) => context.state.last_ledger_date = date,
    handler: ledger_handler
});

function run_pollers(context)
{
    // return first error / resolve
    // handled by clan.registry in run_clans()
    return Promise.race(
    [
        messages_poller.run(context, context.init_date, POLL_MIN_DELAY),
        logs_poller.run(context, context.state.last_log_date, POLL_MIN_DELAY),
        ledger_poller.run(context, context.state.last_ledger_date, POLL_MIN_DELAY),
    ]);
}

module.exports = run_pollers;