const { DEVS_IDS, OWNER_ID } = require('../config');
const { get, put } = require('../api/requests');

function create_member(overrides = {})
{
    return {
        name: undefined,
        balance: 0,
        participating: false,
        coleader: false,
        leader: false,
        dev: false,
        owner: false,
        ...overrides
    };
}

function add_member(context, member_id, overrides = {})
{
    context.state.members.set(member_id, create_member(
    {
        ...overrides,
        owner: member_id === OWNER_ID,
        dev: DEVS_IDS.includes(member_id)   // owner and dev cant be overriden change config.js for that purpose
    }));

    context.storage.schedule_save();
}  

async function set_members(context)
{
    context.state.members = new Map();

    let clan_info;
    let members;

    try
    {
        clan_info = await get(`clans/${context.id}/info`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch clan_info\n${err.message}`);
    }
        
    try
    {
        members = await get(`clans/${context.id}/members`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch clan members\n${err.message}`);
    }

    members.forEach(member =>
    {
        add_member(context, member.playerId,
        {
            name: member.username,
            leader: member.playerId === clan_info.leaderId,
            coleader: member.isCoLeader,
        });
    });
}

function get_member(context, member_id)
{
    const member = context.state.members.get(member_id)

    if(!member) // very unlikely
    {
        throw new Error("Member not in the clan anymore.")
    }

    return member;
}

function remove_member(context, member_id)
{
    context.state.members.delete(member_id);
    context.storage.schedule_save();
}

function change_leader(context, member_id, leader_id)
{
    const former = get_member(context, leader_id);
    former.leader = false;

    const leader = get_member(context, member_id);
    leader.leader = true;
    leader.coleader = false;

    context.storage.schedule_save();
}

function promote(context, member_id)
{
    const coleader = get_member(context, member_id);
    coleader.coleader = true;

    context.storage.schedule_save();
}

function demote(context, coleader_id)
{
    const coleader = get_member(context, coleader_id);
    coleader.coleader = false;

    context.storage.schedule_save();
}

async function update_participating(context)
{
    for (const [member_id, member] of context.state.members.entries())
    {
        const is_participating = member.balance >= context.state.required;

        if (member.participating !== is_participating) 
        {
            try
            {
                const body = { "participateInQuests": is_participating };
                await put(`clans/${context.id}/members/${member_id}/participateInQuests`, body);
                member.participating = is_participating;
            }
            catch(err)
            {
                throw new Error(`Failed to update participating status.\n"${err.message}`);
            }   
        }
    }

    context.storage.schedule_save();
}

function update_balances(context)
{
    for (const [player_id, member] of context.state.members.entries())
    {
        if(member.participating)
        {
            member.balance -= context.state.required;
        }
    }

    context.storage.schedule_save();
}

function update_balance(context, member_id, amount)  // test only
{
    const member = get_member(context, member_id);
    member.balance += amount;

    context.storage.schedule_save();
}


module.exports = { 
    set_members,
    get_member,
    change_leader,
    promote,
    demote,
    add_member,
    remove_member,
    update_balance,
    update_balances,
    update_participating,
};