const run_pollers = require('./src/pollers');
const { set_members } = require('./src/services/clan');
const { set_quests } = require('./src/services/quest');
const { start_cron, stop_cron } = require('./src/utils/cron');
const Storage = require('./src/storage');

class Clan
{
    constructor(id, data_file)
    {
        this.id = id;

        this.state = 
        {
            last_log_date: null,
            last_ledger_date: null,
            required: null,
            members: null,
            quests: null
        }

        this.storage = new Storage(this.state, data_file);

        this.context = 
        {
            id: this.id,
            running: true,
            state: this.state,
            storage: this.storage,
        }
    }

    async stop()
    {
        this.context.running = false;
        stop_cron();
        await this.context.storage.flush();
    }

    async start()
    {
        const data = await this.context.storage.load_data();
        const starting_date = new Date();

        this.context.state.last_log_date = data.last_log_date ? new Date(data.last_log_date) : starting_date;
        this.context.state.last_ledger_date = data.last_ledger_date ? new Date(data.last_ledger_date) : starting_date;
        this.context.state.required = data.required ?? 500;
        this.context.state.members = data.members;

        if(this.context.state.members.size == 0) await set_members(this.context);

        await set_quests(this.context);

        start_cron(this.context);

        try
        {
            run_pollers(this.context, starting_date);
        }
        catch(err)
        {
            console.log(`Unhandled error.\n${err}`);
            await this.stop();
        };
    }
}

module.exports = Clan;