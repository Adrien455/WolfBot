const { post } = require('../api/requests');
const { CLAN_ID } = require('../config');

module.exports =
{
    name: "skip",
    description: "Skip waiting time for next quest tier.",
    strict: true,
    dev: false,

    async execute()
    {
        try
        {
            return await post(`clans/${CLAN_ID}/quests/active/skipWaitingTime`);
        }
        catch(err)
        {
            throw new Error(`Failed skip waiting time.\n${err.message}`);
        }
    }
};