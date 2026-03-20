const { post } = require('../api');
const { CLAN_ID } = require('../config');

module.exports =
{
    name: "extend",
    method: "post",
    description: "Claim additionnal time for the current quest tier.",
    strict: true,

    async execute()
    {
        return await post(`clans/${CLAN_ID}/quests/active/claimTime`);  // doesnt work needs to be tested when a quest is active
    }
};