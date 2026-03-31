const { post } = require('../api/requests');
const { CLAN_ID } = require('../config');

module.exports =
{
    name: "extend",
    description: "Claim additionnal time for the current quest tier.",
    strict: true,
    dev: false,

    async execute()
    {
        try
        {
            return await post(`clans/${CLAN_ID}/quests/active/claimTime`);  
        }
        catch(err)
        {
            throw new Error(`Failed to claim additional time.\n${err.message}`);
        }
        
    }
};