const { validate_config } = require('./src/config');
const { update_clans, run_clans, get_clans } = require('./src/core/clan_registry');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000).unref();

process.on('unhandledRejection', async (reason) => 
{
    console.log('Unhandled rejection:', reason);
    const clans = get_clans();
    await Promise
        .all(Array
            .from(clans.values(), clan => clan.stop()
            .catch(err => console.log(`Failed to stop ${clan.id} clan.\n${err.message}`))));    // guard infinite recursion
});

const RELOAD_INTERVAL = 10 * 60 * 1000; // 10 minutes

async function start()
{    
    validate_config();

    await update_clans()    // init
        .catch(err => 
        {
            console.log(`Critical error at start.\n${err.log_message ?? err.message}`);
            process.exit(1);
        });

    run_clans();  // first run

    setInterval(() => 
    {
        console.log("Updating running clans ...");

    update_clans()    // will restart clans that stopped normally
        .catch(err => 
        {
            console.log("Failed to update clans\n", err.log_message ?? err.message);
        });

    run_clans();

    }, RELOAD_INTERVAL).unref();
}

start();
