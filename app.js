const { load_members } = require('./src/storage');
const { set_members } = require('./src/services/clan');
const { set_quests } = require('./src/services/quest');

const run_pollers = require('./src/pollers');

const { start_cron } = require('./src/utils/cron');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000);  // this will prevent !stop

async function start()
{
  const saved_members = await load_members();

  await set_members(saved_members);
  await set_quests();
  start_cron();

  let starting_date = new Date();

  run_pollers(starting_date);
}

start();
