const {  post } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { update_participating, update_balances } = require('../services/clan');
const { choose_quest, get_required } = require('../services/quest');

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
                throw new Error("Input Error: Wrong argument.\nUndefined, gold and gems are accepted.");
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

        try
        {
            await update_participating(get_required());
        }
        catch(err)
        {
            throw new Error(err.message);
        }

        let response;

        try
        {
            response = await post(`clans/${CLAN_ID}/quests/claim`, { "questId": winner });
        }
        catch(err)
        {
            throw new Error(`Failed to claim quest.\n${err.message}`);
        }

        update_balances(get_required());

        return response;
    }
};