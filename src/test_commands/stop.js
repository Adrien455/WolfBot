const { stop_pollers } = require('../controller');
const { stop_cron } = require('../utils/cron');
const { flush } = require('../storage');
const { get_members } = require('../services/clan');

module.exports =
{
    name: "stop",
    description: "Stops the program.",
    strict: false,
    dev: true,

    async execute()
    {
        flush(get_members());
        stop_cron();
        stop_pollers();
    }
};