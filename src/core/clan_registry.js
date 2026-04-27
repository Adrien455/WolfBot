const get_updated_clans = require('./clan_guard');
const Clan = require('./clan');

const clans = new Map();

async function remove(id)
{
    const clan = clans.get(id);

    if(clan)    // on_unauthorized may be called several times due to the three pollers
    {
        console.log(`Removing clan ${id} ...`);
        clans.delete(id);
    }
}

async function add(id)
{
    const clan = new Clan(id);
    clans.set(id, clan);
    await clan.init();  // error callback will propagate
}

async function update_clans()
{
    const { added, removed } = await get_updated_clans(clans);

    for(const clan_id of added)
    {
        await add(clan_id);
    }

    for(const clan_id of removed)
    {
        remove(clan_id);
    }
}

async function run_clans()
{
    for(const clan_id of clans.keys())
    {
        const clan = clans.get(clan_id);

        if(!clan.context.running)
        {
            clan.start().then(
                async () =>
                {
                    await clan.stop();
                },
                async err => 
                {
                    console.log(`Error in clan ${clan_id}\n${err.log_message ?? err.message}`);
                    await clan.stop();

                    if(err.status === 401)
                    {
                        remove(clan_id);    // clan has removed the bot
                    }
                }
            );
        }
    }
}

const get_clans = () => clans;

module.exports = { update_clans, run_clans, get_clans };