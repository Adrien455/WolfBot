const { state } = require('./state');
 
const fs = require('fs/promises');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../../data/members.json');

let saveTimeout = null;
let queue = Promise.resolve();  // queue of promises

async function load_data()
{
    try
    {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
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
        
        throw new Error("Failed to load. Bad format.");
    }
}

async function save()
{
    try
    {
        const body = {
            date: new Date(),
            last_log_date: state.last_log_date,
            last_ledger_date: state.last_ledger_date,
            required: state.required,
            members: [...state.members]
        };

        const saved = JSON.stringify(body, null, 2);
        const tmp = FILE_PATH + ".tmp";

        await fs.writeFile(tmp, saved);
        await fs.rename(tmp, FILE_PATH);

    }
    catch (err)
    {
        console.error("Save error:", err.code); // add retry or prevent the !stop
    }
}

function sequenced_save()
{
    queue = queue
        .then(() => save())
        .catch(err => {
            console.log("Queue error:", err.code);
            return Promise.resolve();
        });

    return queue;   // flush will wait for the whole queue to be resolved
}

function schedule_save(delay = 1000)
{
    if(saveTimeout) // if save is waiting to execute reset timeout
    {
        clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
        sequenced_save();
    }, delay);
}

async function flush()   // flush timeouts if any to force save
{
    if(saveTimeout)
    {
        clearTimeout(saveTimeout);
    }

    await sequenced_save();
}

module.exports = {
    load_data,
    schedule_save,
    flush
};