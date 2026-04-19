const fs = require("fs");
const { get } = require("../api/requests");
const Clan = require('./clan');

const FILE_PATH = "./src/clan_ids.json";

const clans = new Map();

async function remove(id)
{
    const clan = clans.get(id);

    if(clan)    // on_unauthorized will be called thrice, prevent type error
    {
        await clan.stop();
        clans.delete(id);
    }
}

async function add(id)
{
    const clan = new Clan(id, () => remove(id));
    clans.set(id, clan);
    await clan.start();
}

function diff(updated)
{
    const added = [];
    const removed = [];

    for(const id of updated)
    {
        if (!clans.has(id))
        {
            added.push(id);
        }
    }

    for(const id of clans.keys())
    {
        if (!updated.includes(id))
        {
            removed.push(id);
        }
    }

  return { added, removed };
}

function load_clan_ids()
{
    try
    {
        const raw = fs.readFileSync(FILE_PATH, "utf-8");
        const data = JSON.parse(raw);

        return data.ids;
    }
    catch(err)
    {
        throw new Error(`Fail to load clan ids:\n${err.message}`);
    }
}

async function update()
{    
    try
    {
        const added_clans = await get("clans/authorized");
        const added_ids = added_clans.map((clan) => clan.id);

        const allowed_ids = load_clan_ids();

        const { added, removed } = diff(added_clans);

        for(const id of added)
        {
            if(allowed_ids.includes(id))    // strict
            {
                add(id);
            }
        }

        for(const id of removed)
        {
            remove(id); // not strict
        }

        console.log("Running clans: ", clans.keys());
    }
    catch(err)
    {
        console.log(`Failed to update clans.\n${err.message}`);
    }
}

async function init_clans()
{
    try
    {
        const added_clans = await get("clans/authorized");
        const added_ids = added_clans.map((clan) => clan.id);

        const allowed_ids = load_clan_ids();  // security guard

        for(const id of added_ids)
        {
            if(allowed_ids.includes(id))  // strict
            {
                add(id);
            }
        }

        console.log(clans.keys());
    }
    catch(err)
    {
        throw new Error(`Failed to init clans.\n${err}`);
    }
}

const get_clans = () => clans;

module.exports = { init_clans, update, get_clans };