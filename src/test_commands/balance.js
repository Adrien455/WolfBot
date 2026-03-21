const { update_balance } = require('../services/clan');

module.exports =
{
    name: "balance",
    description: "Adds 500 to the balance of the player",
    strict: false,
    dev: true,

    async execute(player_id)
    {
        update_balance(player_id, 500);
    }
};