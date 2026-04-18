const { post } = require('../api/requests');
const { set_quests } = require('../services/quest');

module.exports =
{
    name: "shuffle",
    description: "Shuffle quests.",
    strict: true,
    dev: false,

    async execute(context)
    {
        let response;

        try
        {   
            response = await post(`clans/${context.id}/quests/available/shuffle`);
        }
        catch(err)
        {
            throw new Error(`Failed to shuffle quests.\n${err.message}`);
        }

        await set_quests(context);
        return response;     
    }
};