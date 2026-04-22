const { set_members } = require('../services/clan_manager');
const { set_quests } = require('../services/quest');
const BotError = require('../utils/error');

module.exports =
{
    name: "clear",
    description: "Clear cache.",
    strict: false,
    dev: true,

    async execute(context)
    {
        try
        {
            await set_members(context);   // THIS WILL RESET MEMBERS BALANCES !!!!!
        }
        catch(err)
        {
            throw new BotError(undefined, `Failed to set members.\n${err.message}`);
        }

        await set_quests(context);
    }
};