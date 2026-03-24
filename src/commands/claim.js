const {  post } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { choose_quest, update_participating, apply_updates } = require('../services/quest');

module.exports =
{
    name: "claim",
    description: "Claim most voted gold quest. Will take the first one in case of draw. Doesnt take votes for shuffle into account. Use !shuffle for that purpose.",
    strict: true,
    dev: false,

    async execute(player_id, type)
    {
        let is_gold;

        switch(type)
        {
            case undefined:
            case "gold":
                is_gold = true;
                break;
            case "gems":
                is_gold = false;
                break;
            default:
                return "Error: Wrong argument. Undefined, gold and gems are accepted.";
        }

        const winner = await choose_quest(is_gold);
        console.log("Winner:", winner);

        const updates = update_participating();
     
        const response = await post(`clans/${CLAN_ID}/quests/claim`, { "questId": winner });

        if(winner && !response) apply_updates(updates);
        
        return response;
    }
};