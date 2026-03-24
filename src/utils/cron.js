const cron = require('node-cron');
const every_monday = '0 0 * * 1';

const { set_quests } = require('../services/quest');

let task;

function start_cron()
{
    task = cron.schedule(every_monday, async () =>
    { 
        try
        {
            await set_quests();
        }
        catch(err)
        {
            throw new Error(err.message);
        }
    },
    {
        timezone: 'UTC'
    });
}

function stop_cron()
{
    if (task)
    {
        task.destroy();
        task = null;
    }
}

module.exports = { start_cron, stop_cron };