const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('../config');
const { log_request, log_processed, log_errors } = require('../utils/monitoring');
const sleep = require('../utils/sleep');
const BotError = require('../utils/error');

const MAX_RETRIES = 3;

function get_error(err, url)
{
    const status = err.status;
    const error = new BotError({message: "Something went wrong.", status: status});
    log_errors();

    if(status === 429)  // not tested
    {
        error.log_message = `Rate limit reached: ${err.response?.body?.message ?? err.message}`;
    }
    else if(status === 400)
    {
        error.log_message = `Bad request: ${err.response?.body?.message}\n${url}`;
        error.message = err.response?.body?.message ?? error.message;   // useful for players
    }
    else if(status === 401)
    {
        error.log_message = `Wrong api key or bot not added.\nAuth Error: ${err.message}`;
    }
    else if(status === 403) // not tested
    {
        error.log_message = `Forbidden request: ${err.response?.body?.message ?? err.message}\n${url}`;
    }
    else if(status === 404)
    {
        error.log_message = `HTTP Error: ${err.response?.body?.message}\n${url}`;
    }
    else if(status === 405)
    {
        error.log_message = `Method not allowed: ${err.message}\n${url}`;
    }
    else if(status >= 500)
    {
        error.log_message = `Server Error: ${err.response?.body?.message}`;
    }
    else if(err.code)
    {
        error.log_message = `Network Error: ${err.code}`;
    }
    else
    {
        console.log(err);
        error.log_message = `Unknown error: ${err.message}`;
    }

    throw error;
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
                const url = method + "/" + endpoint;

                const error = get_error(err, url);
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