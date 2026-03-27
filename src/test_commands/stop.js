const { stop_pollers } = require('../controller');
const { stop_cron } = require('../utils/cron');
const { flush } = require('../storage/storage');

module.exports =
{
    name: "stop",
    description: "Stops the program.",
    strict: false,
    dev: true,

    async execute()
    {
        stop_pollers();
        stop_cron();
        await flush();
    }
};