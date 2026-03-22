const { get, post } = require('./requests');
const { CLAN_ID } = require('../config');

async function get_last_messages()
{
    const endpoint = `clans/${CLAN_ID}/chat`;
    const data = await get(endpoint);

    return data;
}

async function send_message(msg)
{
    const endpoint = `clans/${CLAN_ID}/chat`;
    const body = { "message": msg };
    const data = await post(endpoint, body);
    return data;
}

module.exports = { get_last_messages, send_message };