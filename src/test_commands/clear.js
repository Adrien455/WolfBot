const { set_members } = require('../services/clan');
const { set_quests } = require('../services/quest');

module.exports =
{
    name: "clear",
    description: "Clear cache.",
    strict: false,
    dev: true,

    async execute()
    {
        try
        {
            await set_members();   // THIS WILL RESET MEMBERS BALANCES !!!!!
        }
        catch(err)
        {
            throw new Error(`Failed to set members.\n${err.message}`);
        }

        try
        {
            await set_quests();
        }
        catch(err)
        {
            throw new Error(err.message);
        }
    }
};