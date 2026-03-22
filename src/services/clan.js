const { CLAN_ID, DEV_ID } = require('../config');
const { get, put } = require('../api/requests');

let MEMBERS = new Map();    // keep track of each member information
let VIPS = [];              // may change in game (unlikely) but needs to be updated if so (static for now)
let QUESTS = [];

function create_member()   // may expand fields
{
    return {
        balance: 0,
        is_participating: false
    };
}

async function set_members()
{
    const clan_info = await get(`clans/${CLAN_ID}/info`);
    const members = await get(`clans/${CLAN_ID}/members`);

    const LEADER_ID = clan_info.leaderId;

    const CO_LEADERS_IDS = members
        .filter(member => member.isCoLeader)
        .map(member => member.playerId);

    members.forEach(member => MEMBERS.set(member.playerId, create_member()));
    
    VIPS = [LEADER_ID, DEV_ID, ...CO_LEADERS_IDS];
}

async function update_status(member_id, is_participating)
{
    const member = MEMBERS.get(member_id);
    member.is_participating = is_participating;

    const body = { "participateInQuests": is_participating };
    await put(`clans/${CLAN_ID}/members/${member_id}/participateInQuests`, body);
}

function update_balance(member_id, amount)
{
    const member = MEMBERS.get(member_id);
    member.balance += amount;
}

function update_members(player_id, is_new)
{
    if(is_new)
    {
        MEMBERS.set(player_id, create_member(0, false));
    }
    else
    {
        MEMBERS.delete(player_id);
    }
}

function get_members()
{
    return MEMBERS;
}

function get_vips()
{
    return VIPS;
}

async function set_quests()
{
    QUESTS = await get(`clans/${CLAN_ID}/quests/available`);
}

function get_quests()
{
    return QUESTS;
}

module.exports = { 
    set_members,
    get_members,
    update_members,
    update_balance,
    update_status,
    get_vips,
    set_quests,
    get_quests,
};