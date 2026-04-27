require('dotenv').config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.wolvesville.com";

// public ids
const OWNER_ID = "b5e253a4-1478-47ac-85a1-bdb7c02a2c9c";    // owner of bot

const DEVS_IDS = 
[
    "4ecb4631-556d-4aa6-86cb-26b414cff65a",
    "c4130fa4-073c-4aae-808f-e310c37d223d",
    "a91aa913-a04e-486c-952a-a4bba99de723"
];

function validate_config()
{
    if(!API_KEY)
    {
        console.log("Api key missing in .env file.");
        process.exit(1);
    }
}

module.exports = { API_KEY, BASE_URL, OWNER_ID, DEVS_IDS, validate_config };