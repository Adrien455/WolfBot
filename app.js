const Clan = require('./clan_manager');

const { report } = require('./src/utils/monitoring');
// setInterval(report, 10000).unref();

const CLAN_IDS =
[
    "f40ab7fa-57d1-4bae-87a4-dfa64097765f",
    "778332cc-6627-427a-84f4-08273de0f5d3"
];

const clans = [];

process.on('unhandledRejection', async (reason) => 
{
    console.log('Unhandled rejection:', reason);
    await Promise.all(clans.map(c => c.stop()));
});

async function start()
{
    for(const id of CLAN_IDS)
    {
        const clan = new Clan(id, id.slice(0, 8));
        clan.start();
        clans.push(clan);
    } 
}

start().catch(err =>
{
    console.log(`Critical error at start.\n${err}`);
    process.exit(1);
});
