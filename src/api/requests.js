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

async function request(method, endpoint, body)
{
    const start = Date.now();

    try
    {
        let request = superagent(method, `${BASE_URL}/${endpoint}`)
            .set('Authorization', `Bot ${API_KEY}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');

        if (body)
        {
            request = request.send(body);
        }

        const response = await request;

        log_request(Date.now() - start);
        log_processed(method);

        return response.body;
    }
    catch(err)
    {
        throw new Error(get_error_message(err));
    }
}

const get = (endpoint) => request('GET', endpoint);
const post = (endpoint, body) => request('POST', endpoint, body);
const put = (endpoint, body) => request('PUT', endpoint, body);

module.exports = { get, post, put };