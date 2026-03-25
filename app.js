const { load_data } = require('./src/storage');
const { set_members, load_members } = require('./src/services/clan');
const { set_quests, set_required } = require('./src/services/quest');

const run_pollers = require('./src/pollers');

const { start_cron } = require('./src/utils/cron');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000).unref();

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

async function start()
{
  const { required: saved_required, members: saved_members } = await load_data();

  if(saved_members && saved_members.size != 0)
  {
    await load_members(saved_members);
  }
  else
  {
    await set_members();
  }
  
  await set_quests();
  if(saved_required) set_required(saved_required);
  
  start_cron();

  let starting_date = new Date();

  run_pollers(starting_date);
}

start().catch(err =>
{
  console.error(`Critical error at start.\n${err}`);
  process.exit(1);
});
