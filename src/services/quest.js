const { get } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { get_quests, get_members, update_balance, update_status } = require('../services/clan');

const REQUIRED = 500;   // required amount of gold to participate in a quest
                        // may become adjustable later (static now)

async function update_participating_members()
{
    const members = get_members();

    for (const [player_id, member] of members.entries())
    {
        const is_participating = member.balance >= REQUIRED;

        if (is_participating)
        {
            update_balance(player_id, -500);
        }

        if (member.quest !== is_participating) 
        {
            await update_status(player_id, is_participating);
        }
    }
}

async function choose_quest()
{
    const options = await get(`clans/${CLAN_ID}/quests/votes`);
    const votes = options.votes;

    const gold_quests = get_quests()
        .filter(quest => !quest.purchasableWithGems)
        .map(quest => quest.id);

    let max_id = null;
    let max_count = -1;

    for(const [id, arr] of Object.entries(votes))
    {
        if(gold_quests.includes(id) && arr.length >= max_count)
        {
            max_id = id;
            max_count = arr.length;
        }
    }

    if(max_id)
    {
        await update_participating_members();
    }

    return max_id;
}

module.exports = { choose_quest };