require('dotenv').config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.wolvesville.com";
const CLAN_ID = "f40ab7fa-57d1-4bae-87a4-dfa64097765f";     // works for this clan ONLY
const DEV_ID = "4ecb4631-556d-4aa6-86cb-26b414cff65a";      // CRITICAL HAS ACCESS TO DB

module.exports = { API_KEY, BASE_URL, CLAN_ID, DEV_ID };