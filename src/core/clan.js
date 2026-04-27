const run_pollers = require('../pollers');
const { set_members } = require('../services/clan_manager');
const { set_quests } = require('../services/quest');
const Storage = require('../storage');
const Cron = require('../utils/cron');

class Clan
{
    constructor(id)
    {
        this.id = id;

        this.state =
        {
            last_log_date: null,
            last_ledger_date: null,
            required: null,
            members: null,
            quests: null
        };

        this.storage = new Storage(this.state, id);

        this.context = 
        {
            init_date: new Date(),
            id: this.id,
            running: false,
            state: this.state,
            storage: this.storage
        };

        this.cron = new Cron(this.context);
        this.context.cron = this.cron;
    }

    async init()
    {
        console.log(`Initiating clan ${this.id} ...`);

        const data = await this.context.storage.load_data();

        // tracks ledger / logs that occured when bot was offline after reactivation
        this.context.state.last_log_date = data.last_log_date ? new Date(data.last_log_date) : this.context.init_date;
        this.context.state.last_ledger_date = data.last_ledger_date ? new Date(data.last_ledger_date) : this.context.init_date;
        this.context.state.required = data.required ?? 500;
        this.context.state.members = data.members;

        if(this.context.state.members.size === 0) await set_members(this.context);

        await set_quests(this.context);
    }

    start()
    {
        console.log(`Starting clan ${this.id} ...`);
        this.context.running = true;
        return run_pollers(this.context);
    }

    async stop()
    {
        console.log(`Stopping clan ${this.id} ...`);
        this.context.running = false;
        this.cron.stop();
        await this.context.storage.flush();
    }
}

module.exports = Clan;