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
        await post(`clans/${context.id}/quests/available/shuffle`);
        
        await set_quests(context);

        return "Quests shuffled successfully";
    }
};