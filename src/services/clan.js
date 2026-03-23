const { CLAN_ID, DEVS_IDS, OWNER_ID } = require('../config');
const { get, put } = require('../api/requests');

let MEMBERS = new Map();    // keep track of each member information
let QUESTS = [];            // available quests

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

async function set_members()
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

function remove_member(member_id)
{
    MEMBERS.delete(member_id);
}

function change_leader(member_id, leader_id)
{
    const former = MEMBERS.get(leader_id);
    former.leader = false;

    const leader = MEMBERS.get(member_id);
    leader.leader = true;
    leader.coleader = false;
}

function promote(member_id)
{
    const coleader = MEMBERS.get(member_id);
    coleader.coleader = true;
}

function demote(coleader_id)
{
    const coleader = MEMBERS.get(coleader_id);
    coleader.coleader = false;
}

async function update_status(member_id, is_participating)
{
    const member = MEMBERS.get(member_id);
    member.participating = is_participating;

    const body = { "participateInQuests": is_participating };
    await put(`clans/${CLAN_ID}/members/${member_id}/participateInQuests`, body);
}

function update_balance(member_id, amount)
{
    const member = MEMBERS.get(member_id);
    member.balance += amount;
}

function get_members()
{
    return MEMBERS;
}

async function set_quests()
{
    console.log("Quests set at", new Date());
    QUESTS = await get(`clans/${CLAN_ID}/quests/available`);
}

function get_quests()
{
    return QUESTS;
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
    update_status,
    set_quests,
    get_quests,
};