const { get, post } = require('../api');
const { CLAN_ID } = require('../config');

module.exports =
{
    name: "claim",
    method: "post",
    description: "Claim most voted gold quest. Will take the first one in case of draw. Doesnt take votes for shuffle into account. Use !shuffle in that case.",
    strict: true,

    async execute()
    {
        const options = await get(`clans/${CLAN_ID}/quests/votes`);
        const votes = options.votes;

        const available_quests = await get(`clans/${CLAN_ID}/quests/available`);
        const gold_quests = [];

        for(const quest of available_quests)
        {
            if(!quest.purchasableWithGems)
            {
                gold_quests.push(quest.id);
            }
        }

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

        console.log(max_id);
     
        return await post(`clans/${CLAN_ID}/quests/claim`, { "questId": max_id });
    }
};