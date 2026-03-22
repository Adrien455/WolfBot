const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');

async function post(endpoint, body)
{
    try
    {
    const response = await superagent
        .post(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(body);

        return response.body;
    }
    catch (err)
    {
        const api_message = err.response?.body?.message ?? "Unknown error";

        return `Error: ${api_message}`;
    }
}

async function put(endpoint, body)
{
    try
    {
    const response = await superagent
        .put(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(body);

        return response.body;
    }
    catch (err)
    {
        const api_message = err.response?.body?.message ?? "Unknown error";

        return `Error: ${api_message}`;
    }
}

async function get(endpoint)
{
    try
    {
    const response = await superagent
        .get(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

        return response.body;
    }
    catch (err)
    {
        const api_message = err.response?.body?.message ?? "Unknown error";

        return `Error: ${api_message}`;
    }
}

module.exports = { get, post, put };