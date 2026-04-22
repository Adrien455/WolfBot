const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');
const { log_request, log_processed, log_errors } = require('../utils/monitoring');
const sleep = require('../utils/sleep');
const BotError = require('../utils/error');

const MAX_RETRIES = 3;

function get_error_message(err)
{
    const status = err.status;
    log_errors();

    switch(true)
    {
        case (status === 429):   // not tested
            return `Rate limit reached: ${err.response?.body?.message ?? err.message}`;

        case (status === 400):
            return `Bad request: ${err.response?.body?.message}`;

        case (status === 401):
            return `Wrong api key or bot not added.\nAuth Error: ${err.message}`;

        case (status === 403):   // not tested
            return `Forbidden request: ${err.response?.body?.message ?? err.message}`;

        case (status === 404):
            return `HTTP Error: ${err.response?.body?.message}`;

        case (status === 405):
            return `Method not allowed: ${err.message}`;

        case (status >= 500):
            return `Server Error: ${err.response?.body?.message}`;
    }

    if(err.code)
    {
        return `Network Error: ${err.code}`;
    }

    console.log(err);
    return `Unknown Error: ${err.message}`;
}

async function request(method, endpoint, body)
{
    const start = Date.now();
    let attempts = 0;
    let delay = 1000;

    while(true)
    {
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
            const retryable = err.status === 429
                || err.status >= 500
                || err.code === 'ETIMEDOUT'
                || err.code === 'ECONNABORTED'
                || err.code === 'ECONNRESET';

            if(!retryable || attempts >= MAX_RETRIES)
            {
                const error = new BotError("Something went wrong", get_error_message(err), method + "/" + endpoint);
                error.status = err.status;
                throw error;
            }

            attempts++;
            console.log(`Retry ${attempts} after ${err.status ?? err.code} error.`);
            await sleep(delay);
            delay = Math.min(delay * 2, 10000);
        }
    }
}

const get = (endpoint) => request('GET', endpoint);
const post = (endpoint, body) => request('POST', endpoint, body);
const put = (endpoint, body) => request('PUT', endpoint, body);

module.exports = { get, post, put };