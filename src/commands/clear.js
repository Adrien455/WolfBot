const { set_quests } = require('./../services/clan');

module.exports =
{
    name: "clear",
    description: "Clear cache.",
    strict: true,
    dev: false,

    async execute()
    {
       set_members();   // THIS WILL RESET MEMBERS BALANCES !!!!!
       set_quests();
    }
};