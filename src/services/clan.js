const { CLAN_ID, OWNER_ID} = require('./../config');
const { get } = require('./../api');

let VIPS = [];

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

module.exports = { set_vips, get_vips };