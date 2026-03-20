const { get, post} = require('./../api');
const { CLAN_ID } = require('./../config');

async function getLastMessages()
{
    const endpoint = `clans/${CLAN_ID}/chat`;
    const data = await get(endpoint);

    if(!data || data.length == 0)
    {
        return null;
    }

    return data;
}

async function sendMessage(msg)
{
    const endpoint = `clans/${CLAN_ID}/chat`;
    const body = { "message": msg };
    const data = await post(endpoint, body);
    return data;
}

module.exports = { getLastMessages, sendMessage };