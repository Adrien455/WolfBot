const request = require('superagent');
require('dotenv').config();

const API_KEY = process.env.API_KEY;

async function getPlayer()
{
  try
  {
    const response = await request
      .get('https://api.wolvesville.com/players/b5e253a4-1478-47ac-85a1-bdb7c02a2c9c')
      .set('Authorization', `Bot ${API_KEY}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    return response.body;
  }
  catch (err)
  {
    console.error("Error:", err.response?.text || err.message);
    return "Error";
  }
}

async function run_bot()
{
    const player = await getPlayer();
    console.log("Id:", player.id);
    console.log("Username:", player.username);
    console.log("Level:", player.level);
}

run_bot();