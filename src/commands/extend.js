const { post } = require('../api/requests');

module.exports =
{
    name: "extend",
    description: "Claim additionnal time for the current quest tier.",
    strict: true,
    dev: false,

    async execute(context)
    {
        try
        {
            return await post(`clans/${context.id}/quests/active/claimTime`);  
        }
        catch(err)
        {
            throw new Error(`Failed to claim additional time.\n${err.message}`);
        }
        
    }
};