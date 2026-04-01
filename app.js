const { load_data, schedule_save, flush } = require('./src/storage/storage');
const { set_members } = require('./src/services/clan');
const { set_quests } = require('./src/services/quest');

const { state } = require('./src/storage/state');

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
  data = await load_data();
  starting_date = new Date();

  state.last_log_date = data.last_log_date ? new Date(data.last_log_date) : starting_date;
  state.last_ledger_date = data.last_ledger_date ? new Date(data.last_ledger_date) : starting_date;
  state.required = data.required ?? 500;
  state.members = data.members;

  if(state.members.size == 0) await set_members();

  await set_quests();
  
  start_cron();

  run_pollers(starting_date);
}

start().catch(err =>
{
  console.error(`Critical error at start.\n${err.message}`);
  process.exit(1);
});
