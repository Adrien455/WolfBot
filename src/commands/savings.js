const { get_member} = require('../services/clan_manager');

module.exports =
{
    name: "savings",
    description: "Returns current savings of the player",
    strict: false,
    dev: false,

    async execute(context, member_id)
    {
        const member = get_member(context, member_id);
        
        return `Current savings : ${member.balance}`;
    }
};