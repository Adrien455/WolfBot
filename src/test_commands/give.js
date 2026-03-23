const { update_balance } = require('../services/clan');

module.exports =
{
    name: "give",
    description: "Adds specified value to the balance of the player. If none 500 is added.",
    strict: false,
    dev: true,

    async execute(player_id, value = 500)
    {
        const parsed = parseInt(value, 10);

        if (!Number.isInteger(parsed))
        {
            return "Error: Wrong argument. Please enter integer.";
        }

        update_balance(player_id, parseInt(parsed, 10));
    }
};