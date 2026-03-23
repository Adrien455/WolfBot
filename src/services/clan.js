const { CLAN_ID, DEVS_IDS, OWNER_ID } = require('../config');
const { get, put } = require('../api/requests');
const { schedule_save_members } = require('../storage');

let MEMBERS = new Map();    // keep track of each member information

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
    MEMBERS.set(member_id, create_member(
    {
        ...overrides,
        owner: member_id === OWNER_ID,
        dev: DEVS_IDS.includes(member_id)   // owner and dev cant be overriden change config.js for that purpose
    }));
}

async function set_members(saved_members)
{
    if(saved_members)
    {
        for (const [player_id, member] of saved_members.entries())
        {
            MEMBERS.set(player_id, member);
        }
    }
    else
    {
        const clan_info = await get(`clans/${CLAN_ID}/info`);
        const members = await get(`clans/${CLAN_ID}/members`);

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

    schedule_save_members(MEMBERS);
}

function remove_member(member_id)
{
    MEMBERS.delete(member_id);
    schedule_save_members(MEMBERS);
}

function change_leader(member_id, leader_id)
{
    const former = MEMBERS.get(leader_id);
    former.leader = false;

    const leader = MEMBERS.get(member_id);
    leader.leader = true;
    leader.coleader = false;

    schedule_save_members(MEMBERS);
}

function promote(member_id)
{
    const coleader = MEMBERS.get(member_id);
    coleader.coleader = true;

    schedule_save_members(MEMBERS);
}

function demote(coleader_id)
{
    const coleader = MEMBERS.get(coleader_id);
    coleader.coleader = false;

    schedule_save_members(MEMBERS);
}

async function update_status(member_id, is_participating)
{
    const member = MEMBERS.get(member_id);
    member.participating = is_participating;

    const body = { "participateInQuests": is_participating };
    await put(`clans/${CLAN_ID}/members/${member_id}/participateInQuests`, body);

    schedule_save_members(MEMBERS);
}

function update_balance(member_id, amount)
{
    const member = MEMBERS.get(member_id);
    member.balance += amount;

    schedule_save_members(MEMBERS);
}

function get_members()
{
    return MEMBERS;
}

module.exports = { 
    set_members,
    get_members,
    change_leader,
    promote,
    demote,
    add_member,
    remove_member,
    update_balance,
    update_status
};