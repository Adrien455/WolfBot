const { send_message } = require('../api/message');
const { set_required } = require('../services/quest');

module.exports =
{
    name: "require",
    description: "Change value of gold requirement for a quest.",
    strict: true,
    dev: false,

    async execute(player_id, value = 500)
    {
        if (!/^\d+$/.test(value))
        {
            throw new Error("Input Error: Wrong argument.\nPlease enter positive integer.");
        }

        const parsed = Number(value, 10);

        set_required(parsed);
        return await send_message(`Required gold set at ${parsed}`);
    }
};