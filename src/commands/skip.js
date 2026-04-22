const { post } = require('../api/requests');

module.exports =
{
    name: "skip",
    description: "Skip waiting time for next quest tier.",
    strict: true,
    dev: false,

    async execute(context)
    {
        await post(`clans/${context.id}/quests/active/skipWaitingTime`);
        
        return "Waiting time skipped successfully.";
    }
};