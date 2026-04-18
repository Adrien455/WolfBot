const { get } = require('../api/requests');

async function set_quests(context)
{
    try
    {
        const quests = await get(`clans/${context.id}/quests/available`);

        context.state.quests = quests
            .map((quest) => 
                {
                    return { id: quest.id, purchasableWithGems: quest.purchasableWithGems };
                });
        console.log("Quests set at", new Date());
    }
    catch(err)
    {
        throw new Error(`Failed to fetch quests.\n${err.message}`);
    }
}

function set_required(context, value = 500)
{
    context.state.required = value;

    context.storage.schedule_save();
}

async function choose_quest(context, is_gold)
{
    let options;

    try
    {
        options = await get(`clans/${context.id}/quests/votes`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch quests votes.\n${err.message}`);
    }

    const votes = options.votes;

    const filtered = [];

    for(const quest of context.state.quests)
    {
        if(quest.purchasableWithGems !== is_gold)
        {
            filtered.push(quest.id);
        }
    }

    let max_id = null;
    let max_count = -1;

    for (const id of filtered)  // votes is not sorted
    {
        const arr = votes[id];
        
        if (!arr) continue;

        if (arr.length > max_count) // takes first encountered
        {
            max_id = id;
            max_count = arr.length;
        }
    }

    return max_id;
}

module.exports = { 
    set_quests, 
    choose_quest, 
    set_required,
};