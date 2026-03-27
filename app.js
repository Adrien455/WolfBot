const { load_data } = require('./src/storage/storage');
const { set_members, load_members } = require('./src/services/clan');
const { set_quests, set_required, load_required } = require('./src/services/quest');

const { flush } = require('./src/storage/storage');
const { stop_pollers } = require('./src/controller');

const run_pollers = require('./src/pollers');

const { start_cron, stop_cron } = require('./src/utils/cron');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000).unref();

process.on('unhandledRejection', async (reason) => 
{
  console.error('Unhandled rejection:', reason);
  stop_pollers();
  stop_cron();
  await flush();
});

async function start()
{
  const { required: saved_required, members: saved_members } = await load_data();

  saved_members.size == 0 ? await set_members() : load_members(saved_members);
  !saved_required ? set_required() : load_required(saved_required);
  
  await set_quests();
  
  start_cron();

  let starting_date = new Date();

  run_pollers(starting_date);
}

start().catch(err =>
{
  console.error(`Critical error at start.\n${err.message}`);
  process.exit(1);
});
