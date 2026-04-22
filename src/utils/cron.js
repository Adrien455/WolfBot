const cron = require('node-cron');
const every_monday = '0 0 * * 1';

const { set_quests } = require('../services/quest');

class Cron
{
    constructor(context)
    {
        this.task = cron.schedule(every_monday, async () =>
        {     
            await set_quests(context)
                .catch(err => console.log(err.message));
        },
        {
            timezone: 'UTC'
        });   
    }

    stop()
    {
        this.task.destroy();
    }
}

module.exports = Cron;