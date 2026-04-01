const { send_message } = require('../api/message');
const { get_member} = require('../storage/state');

module.exports =
{
    name: "savings",
    description: "Returns current savings of the player",
    strict: false,
    dev: false,

    async execute(member_id)
    {
        const member = get_member(member_id);
        return await send_message(`Current savings : ${member.balance}`);
    }
};