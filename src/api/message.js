const { get, post } = require('./requests');

async function get_last_messages(context)
{
    return await get(`clans/${context.id}/chat`);
}

async function send_message(context, msg)
{
    const body = { "message": msg };
    return await post(`clans/${context.id}/chat`, body);
}

module.exports = { get_last_messages, send_message };