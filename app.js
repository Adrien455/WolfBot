const run_bot = require('./src/bot');
const { set_members, set_quests } = require('./src/services/clan');
const cron = require('node-cron');

const every_monday = '0 0 * * 1';

cron.schedule(every_monday, () => { set_quests(); });

async function start()
{
  await set_members();
  await set_quests();

  run_bot();
}

start();