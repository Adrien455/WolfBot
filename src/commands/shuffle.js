const { post } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { set_quests } = require('../services/quest');

module.exports =
{
    name: "shuffle",
    description: "Shuffle quests.",
    strict: true,
    dev: false,

    async execute()
    {
        let response;

        try
        {   
            response = await post(`clans/${CLAN_ID}/quests/available/shuffle`);
        }
        catch(err)
        {
            throw new Error(`Failed to shuffle quests.\n${err.message}`);
        }

        await set_quests();
        return response;     
    }
};