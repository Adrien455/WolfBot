const fs = require('fs/promises');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../data/members.json');

let saveTimeout = null;

async function load_members()
{
    try
    {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        const parsed = JSON.parse(data);

        console.log("Found data.")

        return new Map(parsed);
    }
    catch (err)
    {
        if (err.code === "ENOENT")
        {
            console.log("No previous data found.");
            return undefined;
        }

        console.error("Load error:", err);
        return undefined;
    }
}

async function save(members)
{
    try
    {
        const data = JSON.stringify([...members], null, 2);

        const tmp = FILE_PATH + ".tmp";

        await fs.writeFile(tmp, data);
        await fs.rename(tmp, FILE_PATH);

    }
    catch (err)
    {
        console.error("Save error:", err.code);
    }
}

function schedule_save_members(members, delay = 1000)
{
    if(saveTimeout) // if save is waiting to execute reset timeout
    {
        clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
        save(members);
    }, delay);
}

async function flush(members)   // flush timeouts if any to force save (unused)
{
    if(saveTimeout)
    {
        clearTimeout(saveTimeout);
    }

    await save(members);
}

module.exports = {
    load_members,
    schedule_save_members,
    flush
};