const { set_vips, set_quests } = require('./../services/clan');

module.exports =
{
    name: "clear",
    method: "none",
    description: "Clear cache.",
    strict: true,

    async execute()
    {
       set_vips();
       set_quests();
    }
};