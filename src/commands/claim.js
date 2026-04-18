const {  post } = require('../api/requests');
const { update_participating, update_balances } = require('../services/clan_manager');
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

    async execute(context, player_id, type)
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

        const winner = await choose_quest(context, is_gold);
        console.log("Winner:", winner);

        await update_participating(context);   // not critical even if post throws

        let response;

        try
        {
            response = await post(`clans/${context.id}/quests/claim`, { "questId": winner });
        }
        catch(err)
        {
            throw new Error(`Failed to claim quest.\n${err.message}`);
        }

        update_balances(context);  

        return response;
    }
};