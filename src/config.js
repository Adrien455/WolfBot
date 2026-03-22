require('dotenv').config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.wolvesville.com";

const CLAN_ID = "f40ab7fa-57d1-4bae-87a4-dfa64097765f";     // works for this clan ONLY

const OWNER_ID = "b5e253a4-1478-47ac-85a1-bdb7c02a2c9c";    // owner of bot

// CRITICAL HAS ACCESS TO DB
const DEVS_IDS = 
[
    "4ecb4631-556d-4aa6-86cb-26b414cff65a",
    "c4130fa4-073c-4aae-808f-e310c37d223d"
];

module.exports = { API_KEY, BASE_URL, CLAN_ID, OWNER_ID, DEVS_IDS };