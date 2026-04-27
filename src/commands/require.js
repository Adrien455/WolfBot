const { set_required } = require('../services/quest');
const BotError = require('../utils/error');

module.exports =
{
    name: "require",
    description: "Change value of gold requirement for a quest.",
    strict: true,
    dev: false,

    async execute(context, player_id, value = 500)
    {
        if (!/^\d+$/.test(value))
        {
            throw new BotError({
                message: "Please enter positive integer.",
                log_message: "Input Error: Wrong argument."
            });
        }

        const parsed = Number(value);

        set_required(context, parsed);

        return `Required gold set at ${parsed}`;
    }
};