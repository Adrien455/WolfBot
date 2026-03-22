const { get_members } = require('../services/clan');
const { send_message } = require('../api/message');

module.exports =
{
    name: "savings",
    description: "Returns current savings of the player",
    strict: false,
    dev: false,

    async execute(member_id)
    {
        const member = get_members().get(member_id);
        return await send_message(`Current savings : ${member.balance}`);
    }
};