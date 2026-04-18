const { send_message } = require('../api/message');

module.exports =
{
    name: "price",
    description: "Returns gold / gems required to participate in quest.",
    strict: false,
    dev: false,

    async execute(context)
    {
        return await send_message(context, `Required for next quest: ${context.state.required}`);
    }
};