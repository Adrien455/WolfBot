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
        const parsed = parseInt(value, 10);

        if (!Number.isInteger(parsed) || parsed < 0)
        {
            return "Error: Wrong argument. Please enter positive integer.";
        }

        set_required(parsed);
        return await send_message(`Required gold set at ${parsed}`);
    }
};