const { stop_cron } = require('../utils/cron');

module.exports =
{
    name: "stop",
    description: "Stops the program.",
    strict: false,
    dev: true,

    async execute(context)
    {
        context.running = false;
        stop_cron();
        await context.storage.flush();
    }
};