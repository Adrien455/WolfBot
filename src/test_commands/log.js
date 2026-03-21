const { get_members } = require('../services/clan');

module.exports =
{
    name: "log",
    description: "Logs members DB",
    strict: false,
    dev: true,

    async execute()
    {
        console.log(get_members());
    }
};