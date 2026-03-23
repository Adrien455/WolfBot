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
        const response = await post(`clans/${CLAN_ID}/quests/available/shuffle`);

        if(!response) await set_quests();

        return response;
    }
};