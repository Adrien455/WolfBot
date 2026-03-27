const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');
const { log_request, log_processed, log_errors } = require('../utils/monitoring');

function get_error_message(err)
{
    const status = err.status;
    log_errors();

    switch(true)
    {
        case (status == 429):
            return `Rate limit reached: ${err.response?.body?.message}`;    // not tested

        case (status == 400):
            return `Bad request: ${err.response?.body?.message}`;

        case (status == 401):
            return `Auth Error: ${err.message}\nYour api key may be wrong.`;

        case (status == 403):
            return `Forbidden request: ${err.response?.body?.message ?? err.message}`;  // not tested

        case (status == 404):
            return `HTTP Error: ${err.response?.body?.message}`;

        case (status >= 500):
            return `Server Error: ${err.response?.body?.message}`;
    }

    if(err.code)
    {
        return `Network Error: ${err.code}`;
    }

    return `Unknown Error: ${err.message ?? err}`;
}

async function request(method, endpoint, body)
{
    const start = Date.now();

    try
    {
        let request = superagent(method, `${BASE_URL}/${endpoint}`)
            .set('Authorization', `Bot ${API_KEY}`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .timeout({ response: 5000, deadline: 10000 });

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