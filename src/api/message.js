const { get, post } = require('./requests');

async function get_last_messages(context)
{
    try
    {
        return await get(`clans/${context.id}/chat`);
    }
    catch(err)
    {
        throw new Error(`Failed to get a message.\n${err.message}`);
    }
}

async function send_message(context, msg)
{
    try
    {
        const body = { "message": msg };
        return await post(`clans/${context.id}/chat`, body);
    }
    catch(err)
    {
        throw new Error(`Failed to send a message.\n${err.message}`);
    }
}

module.exports = { get_last_messages, send_message };