const {  post } = require('../api/requests');
const { update_participating, update_balances } = require('../services/clan_manager');
const { choose_quest } = require('../services/quest');
const BotError = require('../utils/error');

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
        else if(type === "gems" || type === "gem")
        {
            is_gold = false;
        }
        else
        {
            throw new BotError("Argument is wrong. Gold, gem or gems are accepted.", "Input Error: Wrong argument.");
        }

        const winner = await choose_quest(context, is_gold);
        console.log("Winner:", winner);

        await update_participating(context);   // not critical even if post throws

        await post(`clans/${context.id}/quests/claim`, { "questId": winner });

        update_balances(context);  

        return "Quest claimed successfully";
    }
};