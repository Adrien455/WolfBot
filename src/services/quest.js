const { get } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { get_members, update_balance, update_status } = require('../services/clan');

let QUESTS = [];            // available quests
let REQUIRED = 500;         // set to 500, can be changed via !require

async function set_quests()
{
    console.log("Quests set at", new Date());

    try
    {
        QUESTS = await get(`clans/${CLAN_ID}/quests/available`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch quests.\n${err.message}`);
    }
}

function get_quests()
{
    return QUESTS;
}

function set_required(value)
{
    REQUIRED = value;
}

function get_required()
{
    return REQUIRED;
}

function update_participating()
{
    const members = get_members();

    const updates = [];

    for(const [player_id, member] of members.entries())
    {
        const is_participating = member.balance >= REQUIRED;

        if (is_participating)
        {
            updates.push({
                player_id,
                payment: -REQUIRED
            });
        }

        if (member.participating !== is_participating) 
        {
            updates.push({
                player_id,
                participating: is_participating
            });
        }
    }

    return updates;
}

async function apply_updates(updates)
{
    for(const update of updates)
    {
        if(update.payment)
        {
            update_balance(update.player_id, update.payment);
        }

        if(update.participating !== undefined)
        {
            try
            {
                await update_status(update.player_id, update.participating);
            }
            catch(err)
            {
                throw new Error(err.message);
            }
        }
    }
}

async function choose_quest(is_gold)
{
    let options;

    try
    {
        options = await get(`clans/${CLAN_ID}/quests/votes`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch quests votes.\n${err.message}`);
    }

    const votes = options.votes;

    const filtered = [];

    for(const quest of QUESTS)
    {
        if(quest.purchasableWithGems !== is_gold)
        {
            filtered.push(quest.id);
        }
    }

    let max_id = null;
    let max_count = -1;

    for(const [id, arr] of Object.entries(votes))
    {
        if(filtered.includes(id) && arr.length >= max_count)
        {
            max_id = id;
            max_count = arr.length;
        }
    }

    return max_id;
}

module.exports = { set_quests, get_quests, choose_quest, set_required, get_required, update_participating, apply_updates };