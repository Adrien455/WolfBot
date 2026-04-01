const { CLAN_ID, DEVS_IDS, OWNER_ID } = require('../config');
const { get, put } = require('../api/requests');
const { schedule_save } = require('../storage/storage');
const { state, get_member } = require('../storage/state');

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

function add_member(member_id, overrides = {})
{
    state.members.set(member_id, create_member(
    {
        ...overrides,
        owner: member_id === OWNER_ID,
        dev: DEVS_IDS.includes(member_id)   // owner and dev cant be overriden change config.js for that purpose
    }));

    schedule_save();
}  

async function set_members()
{
    state.members = new Map();

    let clan_info;
    let members;

    try
    {
        clan_info = await get(`clans/${CLAN_ID}/info`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch clan_info\n${err.message}`);
    }
        
    try
    {
        members = await get(`clans/${CLAN_ID}/members`);
    }
    catch(err)
    {
        throw new Error(`Failed to fetch clan members\n${err.message}`);
    }

    members.forEach(member =>
    {
        add_member(member.playerId,
        {
            name: member.username,
            leader: member.playerId === clan_info.leaderId,
            coleader: member.isCoLeader,
        });
    });
}

function remove_member(member_id)
{
    state.members.delete(member_id);
    schedule_save();
}

function change_leader(member_id, leader_id)
{
    const former = get_member(leader_id);
    former.leader = false;

    const leader = get_member(member_id);
    leader.leader = true;
    leader.coleader = false;

    schedule_save();
}

function promote(member_id)
{
    const coleader = get_member(member_id);
    coleader.coleader = true;

    schedule_save();
}

function demote(coleader_id)
{
    const coleader = get_member(coleader_id);
    coleader.coleader = false;

    schedule_save();
}

async function update_participating()
{
    for (const [member_id, member] of state.members.entries())
    {
        const is_participating = member.balance >= state.required;

        if (member.participating !== is_participating) 
        {
            try
            {
                const body = { "participateInQuests": is_participating };
                await put(`clans/${CLAN_ID}/members/${member_id}/participateInQuests`, body);
                member.participating = is_participating;
            }
            catch(err)
            {
                throw new Error(`Failed to update participating status.\n"${err.message}`);
            }   
        }
    }

    schedule_save();
}

function update_balances()
{
    for (const [player_id, member] of state.members.entries())
    {
        if(member.participating)
        {
            member.balance -= state.required;
        }
    }

    schedule_save();
}

function update_balance(member_id, amount)
{
    const member = get_member(member_id);
    member.balance += amount;

    schedule_save();
}


module.exports = { 
    set_members,
    change_leader,
    promote,
    demote,
    add_member,
    remove_member,
    update_balance,
    update_balances,
    update_participating,
};