const { CLAN_ID, OWNER_ID} = require('./../config');
const { get } = require('./../api');

let VIPS = [];
let QUESTS = [];

async function set_vips()
{
    const leader = await get(`clans/${CLAN_ID}/info`);
    const members = await get(`clans/${CLAN_ID}/members`);

    const LEADER_ID = leader.leaderId;

    const CO_LEADERS_IDS = members
        .filter(member => member.isCoLeader)
        .map(member => member.playerId)

    VIPS = [LEADER_ID, OWNER_ID, ...CO_LEADERS_IDS];
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

module.exports = { set_vips, get_vips, set_quests, get_quests };