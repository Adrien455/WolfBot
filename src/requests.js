const superagent = require('superagent');
const { API_KEY, BASE_URL } = require('./config');

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
        console.error("Error:", err.response?.text || err.message);
        return null;
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
        console.error("Error:", err.response?.text || err.message);
        return null;
    }
}

module.exports = { get, post };