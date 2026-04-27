const { post } = require('../api/requests');

module.exports =
{
    name: "extend",
    description: "Claim additionnal time for the current quest tier.",
    strict: true,
    dev: false,

    async execute(context)
    {
        await post(`clans/${context.id}/quests/active/claimTime`);  

        return "Time successfully extended";
    }
};