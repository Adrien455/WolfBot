const { send_message } = require('../api/message');

module.exports =
{
    name: "greet",
    description: "Say hello in the clan chat",
    strict: false,
    dev: false,

    async execute(context)
    {
        return await send_message(context, "Beep Beep I'm a bot.");
    }
};