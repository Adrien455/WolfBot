const {  post } = require('../api/requests');
const { CLAN_ID } = require('../config');
const { update_participating, update_balances } = require('../services/clan');
const { choose_quest } = require('../services/quest');

module.exports =
{
    name: "claim",
    description: `Claim most voted gold quest.
                Will take the last one in case of draw.
                Doesnt take votes for shuffle into account.
                Use !shuffle for that purpose.`,
    strict: true,
    dev: false,

    async execute(player_id, type)
    {
        let is_gold;

        if(type === undefined || type === "gold")
        {
            is_gold = true;
        }
        else if(type === "gems")
        {
            is_gold = false;
        }
        else
        {
            throw new Error("Input Error: Wrong argument.\nUndefined, gold and gems are accepted.");
        }

        const winner = await choose_quest(is_gold);
        console.log("Winner:", winner);

        await update_participating();

        let response;

        try
        {
            response = await post(`clans/${CLAN_ID}/quests/claim`, { "questId": winner });
        }
        catch(err)
        {
            throw new Error(`Failed to claim quest.\n${err.message}`);
        }

        update_balances();  

        return response;
    }
};