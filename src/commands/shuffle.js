const { post } = require('./../api');
const { CLAN_ID } = require('./../config');

module.exports =
{
    name: "shuffle",
    description: "Shuffle quests.",
    strict: true,
    dev: false,

    async execute()
    {
        return await post(`clans/${CLAN_ID}/quests/available/shuffle`);
    }
};