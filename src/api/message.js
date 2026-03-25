const { get, post } = require('./requests');
const { CLAN_ID } = require('../config');

async function get_last_messages()
{
    try
    {
        return await get(`clans/${CLAN_ID}/chat`);
    }
    catch(err)
    {
        throw new Error(`Failed to get a message.\n${err.message}`);
    }
}

async function send_message(msg)
{
    try
    {
        const body = { "message": msg };
        return await post(`clans/${CLAN_ID}/chat`, body);
    }
    catch(err)
    {
        throw new Error(`Failed to send a message.\n${err.message}`);
    }
}

module.exports = { get_last_messages, send_message };