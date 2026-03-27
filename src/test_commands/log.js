const state = require('../storage/state');

module.exports =
{
    name: "log",
    description: "Logs members DB",
    strict: false,
    dev: true,

    async execute()
    {
        console.log(state);
    }
};