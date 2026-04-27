const fs = require("fs");
const { get } = require('../api/requests');

const FILE_PATH = "./src/clan_ids.json";

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

function diff(original = new Map(), updated)
{
    const added = [];
    const removed = [];

    for(const id of updated)
    {
        if (!original.has(id))
        {
            added.push(id);
        }
    }

    for(const id of original.keys())
    {
        if (!updated.includes(id))
        {
            removed.push(id);
        }
    }

    return { added, removed };
}

async function get_updated_clans(original)
{
    const added_clans = await get("clans/authorized");  // api
    const added_ids = added_clans.map((clan) => clan.id);

    const allowed = load_clan_ids();    // json

    const { added, removed } = diff(original, added_ids);
    added.filter(clan => allowed.includes(clan));
    // json list takes precedence over the api ids
    // consider it as an additional security layer if you want full control over who uses the bot

    return { added, removed };
}

module.exports = get_updated_clans;