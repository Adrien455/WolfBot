const { send_message } = require('../api/message');
const state = require('../storage/state');

module.exports =
{
    name: "savings",
    description: "Returns current savings of the player",
    strict: false,
    dev: false,

    async execute(member_id)
    {
        const member = state.members.get(member_id);
        return await send_message(`Current savings : ${member.balance}`);
    }
};