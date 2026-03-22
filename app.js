const chat_poller = require('./src/pollers/chat_poller');
const logs_poller = require('./src/pollers/logs_poller');
const ledger_poller = require('./src/pollers/ledger_poller');
const { set_members, set_quests } = require('./src/services/clan');
const sleep = require('./src/utils');

const { report } = require('./src/monitoring');
setInterval(report, 10000);

const cron = require('node-cron');
const every_monday = '0 0 * * 1';

cron.schedule(every_monday, async () => { await set_quests(); });

async function start()
{
  await set_members();
  await set_quests();

  let starting_date = new Date();

  chat_poller(starting_date);
  await sleep(700);
  logs_poller(starting_date);
  await sleep(700);
  ledger_poller(starting_date);
}

start();