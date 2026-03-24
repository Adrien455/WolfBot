const { send_message } = require('../api/message');
const { get_required } = require('../services/quest');

module.exports =
{
    name: "price",
    description: "Returns gold / gems required to participate in quest.",
    strict: false,
    dev: false,

    async execute()
    {
        return await send_message(`Required for next quest: ${get_required()}`);
    }
};