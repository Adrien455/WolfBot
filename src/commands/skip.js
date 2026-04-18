const { post } = require('../api/requests');

module.exports =
{
    name: "skip",
    description: "Skip waiting time for next quest tier.",
    strict: true,
    dev: false,

    async execute(context)
    {
        try
        {
            return await post(`clans/${context.id}/quests/active/skipWaitingTime`);
        }
        catch(err)
        {
            throw new Error(`Failed skip waiting time.\n${err.message}`);
        }
    }
};