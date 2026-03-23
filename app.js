const { set_members, set_quests } = require('./src/services/clan');
const run_pollers = require('./src/pollers');

const { report } = require('./src/monitoring');
// setInterval(report, 10000);

const cron = require('node-cron');
const every_monday = '0 0 * * 1';

cron.schedule(every_monday, async () => { 
  await set_quests(); }, 
  {
    timezone: 'UTC'
});

async function start()
{
  await set_members();
  await set_quests();

  let starting_date = new Date();

  run_pollers(starting_date);
}

start();