const { sendMessage } = require('./../services/message');

module.exports =
{
    name: "greet",
    method: "post",
    description: "Say hello in the clan chat",
    strict: false,

    async execute()
    {
        return await sendMessage("Beep Beep I'm a bot.");
    }
};