const { sendMessage } = require('./../services/message');

module.exports =
{
    name: "greet",
    description: "Say hello in the clan chat",
    strict: false,
    dev: false,

    async execute()
    {
        return await sendMessage("Beep Beep I'm a bot.");
    }
};