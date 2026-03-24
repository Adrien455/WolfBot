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
                throw new Error("Error: Wrong argument. Undefined, gold and gems are accepted.");
        }

        let winner;

        try
        {
            winner = await choose_quest(is_gold);
        }
        catch(err)
        {
            throw new Error(err.message);
        }

        console.log("Winner:", winner);

        const updates = update_participating();
        let response;

        try
        {
            response = await post(`clans/${CLAN_ID}/quests/claim`, { "questId": winner });
        }
        catch(err)
        {
            throw new Error(`Failed to claim quest.\n${err.message}`);
        }

        try
        {
            apply_updates(updates);
        }
        catch(err)
        {
            throw new Error(err.message);
        }

        return response;
    }
};