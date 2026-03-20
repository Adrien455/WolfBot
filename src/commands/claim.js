const {  post } = require('../api');
const { CLAN_ID } = require('../config');
const { choose_quest } = require('./../services/choose_quest');

module.exports =
{
    name: "claim",
    method: "post",
    description: "Claim most voted gold quest. Will take the first one in case of draw. Doesnt take votes for shuffle into account. Use !shuffle for that purpose.",
    strict: true,

    async execute()
    {
        winner = await choose_quest();
     
        return await post(`clans/${CLAN_ID}/quests/claim`, { "questId": winner });
    }
};