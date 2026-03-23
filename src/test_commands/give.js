const { update_balance } = require('../services/clan');

module.exports =
{
    name: "give",
    description: "Adds specified value to the balance of the player. If none 500 is added.",
    strict: false,
    dev: true,

    async execute(player_id, value = 500)
    {
        if (!/^-?\d+$/.test(value))
        {
            return "Error: Wrong argument. Please enter integer.";
        }

        const parsed = Number(value);

        update_balance(player_id, parsed, 10);
    }
};