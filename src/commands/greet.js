const { send_message } = require('../api/message');

module.exports =
{
    name: "greet",
    description: "Say hello in the clan chat",
    strict: false,
    dev: false,

    async execute()
    {
        return await send_message("Beep Beep I'm a bot.");
    }
};