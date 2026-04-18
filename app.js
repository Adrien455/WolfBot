const { init_clans, update, get_clans } = require('./src/core/clan_registry');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000).unref();

process.on('unhandledRejection', async (reason) => 
{
    console.log('Unhandled rejection:', reason);
    const clans = get_clans();
    await Promise.all(Array.from(clans.values(), clan => clan.stop()));
});

const RELOAD_INTERVAL = 10 * 60 * 1000; // 10 minutes

async function start()
{
    try
    {
        await init_clans();
    }
    catch(err)
    {
        console.log(`Critical error at start.\n${err.message}`);
        process.exit(1);
    }

    setInterval(() => 
    {
        console.log("Updating authorized clans ...");
        update();
    }, RELOAD_INTERVAL).unref();
}

start();
