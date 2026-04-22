const { update_balance } = require('../services/clan_manager');
const BotError = require('../utils/error');

module.exports =
{
    name: "give",
    description: "Adds specified value to the balance of the player. If none 500 is added.",
    strict: false,
    dev: true,

    async execute(context, player_id, value = 500)
    {
        if (!/^-?\d+$/.test(value))
        {
            throw new BotError("Please enter integer.", "Input Error: Wrong argument.\n");
        }

        const parsed = Number(value);

        update_balance(context, player_id, parsed);
    }
};