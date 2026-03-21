const { post } = require('../api');
const { CLAN_ID } = require('../config');

module.exports =
{
    name: "skip",
    description: "Skip waiting time for next quest tier.",
    strict: true,
    dev: false,

    async execute()
    {
        return await post(`clans/${CLAN_ID}/quests/active/skipWaintingTime`);  // doesnt work needs to be tested when a quest is active
    }
};