const run_bot = require('./src/bot');
const { set_vips } = require('./src/services/clan');

async function start()
{
  await set_vips();

  run_bot();
}

start();