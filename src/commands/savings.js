const { send_message } = require('../api/message');
const { get_member} = require('../services/clan');

module.exports =
{
    name: "savings",
    description: "Returns current savings of the player",
    strict: false,
    dev: false,

    async execute(context, member_id)
    {
        const member = get_member(context, member_id);
        return await send_message(context, `Current savings : ${member.balance}`);
    }
};