const fs = require('fs/promises');
const path = require('path');

class Storage 
{
    constructor(state, data_id)
    {
        this.state = state;
        this.data_id = path.join(__dirname, `../data/${data_id}.json`);;
        this.saveTimeout = null;
        this.queue = Promise.resolve();
    }

    async load_data()
    {
        try
        {
            const data = await fs.readFile(this.data_id, 'utf-8');
            const parsed = JSON.parse(data);

            console.log("Found data.")

            return { 
                last_log_date: parsed.last_log_date,
                last_ledger_date: parsed.last_ledger_date,
                required: parsed.required,
                members: new Map(parsed.members)
            };
        }
        catch (err)
        {
            if (err.code === "ENOENT")
            {
                console.log("No previous data found.");
                return { required: 500, members: new Map() };
            }
        
            throw new Error(`Failed to load. Bad format: ${err.message}`);
        }
    }

    async save()
    {
        try
        {
            const body = {
                date: new Date(),
                last_log_date: this.state.last_log_date,
                last_ledger_date: this.state.last_ledger_date,
                required: this.state.required,
                members: [...this.state.members]
            };

            const saved = JSON.stringify(body, null, 2);
            const tmp = this.data_id + ".tmp";

            await fs.writeFile(tmp, saved);
            await fs.rename(tmp, this.data_id);

        }
        catch (err)
        {
            console.log("Save error:", err);
            // if last save throws (!stop or unhandled error) data is lost
        }
    }

    sequenced_save()
    {
        this.queue = this.queue
            .then(() => this.save())
            .catch(err => {
                console.log("Queue error:", err.code);
                return Promise.resolve();
            });

        return this.queue;   // flush will wait for the whole queue to be resolved
    }

    schedule_save(delay = 1000)
    {
        if(this.saveTimeout) // if save is waiting to execute reset timeout
        {
        clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(() => {
            this.sequenced_save();
        }, delay);
    }

    async flush()   // flush timeouts if any to force save
    {
        if(this.saveTimeout)
        {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }

        await this.sequenced_save();
    }
}

module.exports = Storage;