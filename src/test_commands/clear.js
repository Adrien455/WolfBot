const { set_quests, set_members } = require('../services/clan');

module.exports =
{
    name: "clear",
    description: "Clear cache.",
    strict: true,
    dev: true,

    async execute()
    {
       set_members();   // THIS WILL RESET MEMBERS BALANCES !!!!!
       set_quests();
    }
};