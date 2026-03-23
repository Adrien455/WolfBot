const cron = require('node-cron');
const every_monday = '0 0 * * 1';

const { set_quests } = require('../services/quest');

let task;

function start_cron()
{
    task = cron.schedule(every_monday, async () =>
    { 
        await set_quests(); 
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