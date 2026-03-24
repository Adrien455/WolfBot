const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');
const { log_request, log_processed, log_api_errors, log_network_errors } = require('../utils/monitoring');

function get_error_message(err)
{
    if(err.response?.body?.message)
    {
        log_api_errors();
        return `Game Error: ${err.response.body.message}`;
    }

    if(err.code)
    {
        log_network_errors();
        return `Network Error: ${err.code}`;
    }

    return "Unknown Error";
}

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
    catch(err)
    {
        throw new Error(get_error_message(err));
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
    catch(err)
    {
        throw new Error(get_error_message(err));
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
    catch(err)
    {
        throw new Error(get_error_message(err));
    }
}

module.exports = { get, post, put };