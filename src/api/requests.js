const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');
const { log_request, log_processed } = require('../monitoring');

async function post(endpoint, body)
{
    const start = Date.now();

    try
    {
    const response = await superagent
        .post(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(body);

        log_request(Date.now() - start);
        log_processed("post");
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
    const start = Date.now();

    try
    {
    const response = await superagent
        .put(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(body);

        log_request(Date.now() - start);
        log_processed("put");
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
    const start = Date.now();

    try
    {
    const response = await superagent
        .get(`${BASE_URL}/${endpoint}`)
        .set('Authorization', `Bot ${API_KEY}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

        log_request(Date.now() - start);
        log_processed("get");
        return response.body;
    }
    catch (err)
    {
        const api_message = err.response?.body?.message ?? "Unknown error";

        return `Error: ${api_message}`;
    }
}

module.exports = { get, post, put };