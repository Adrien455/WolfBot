const { get } = require('./../api');
const { CLAN_ID } = require('./../config');
;const { get_quests } = require('./../services/clan');

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

    return max_id;
}

module.exports = { choose_quest };