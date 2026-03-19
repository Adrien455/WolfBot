const { get, post} = require('./requests');

async function getLastMessage()
{
    const endpoint = "clans/f40ab7fa-57d1-4bae-87a4-dfa64097765f/chat";
    const data = await get(endpoint);

    if(!data || data.length == 0)
    {
        return null;
    }

    return data[0].msg;
}

async function sendMessage(msg)
{
    const endpoint = "clans/f40ab7fa-57d1-4bae-87a4-dfa64097765f/chat";
    const body = { "message": msg };
    const data = await post(endpoint, body);
    return data;
}

module.exports = { getLastMessage, sendMessage };