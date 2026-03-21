# WolfBot

WolfBot is a Node.js bot for the game Wolvesville.
It interacts with clan chat through commands to execute automated tasks.

## Installation

### Clone repository :

```bash
git clone https://github.com/Adrien455/WolfBot.git
cd WolfBot
```

### Install dependencies :

```bash
npm install
```

### Set up API :

Create an .env file at the repository root and put your personal api key:

```env
API_KEY = "MY_API_KEY"
```
**⚠️ Warning :** This file is **critical** and must stay **confidential**. You can reset it in game's settings in case of accidental push / any leaks.

### Set your Clan Id :

Set your clan Id in `config.js`:

```js
const CLAN_ID = "MY_CLAN_ID"; 
```

You can get it with [wolvesville_api](https://api-docs.wolvesville.com/) followed by the proper endpoints either by using postman, `curl` or others.
See the [documentation](https://api-docs.wolvesville.com/) for the endpoints.

### Launch bot :

```bash
node app.js
```

## Commands :

### Prefix : `!`

- `!greet` → The bot says hi.

- `!claim` → Select the most voted gold quest. In case of tie the last encountered one will be selected. Does not take votes for shuffle into account.

- `!shuffle` → Shuffle available quests.

- `!skip` → Skip waiting time between two quest stages.

- `!extend` → Extend given time for a quest stage.

## Dev :

To enable developer-only commands, set your player ID in `config.js`:

```js
const DEV_ID = "MY_DEV_ID"; 
```

## Devs Commands :

These commands are for devs ONLY and can modify the database. Only player with DEV_ID can use them. 

- `!balance` -> Adds 500 gold to the balance of a member in MEMBERS database.

- `!log` -> Logs the MEMBERS database.

- `!clear` → Clear cache of available quests and members.

## Notes

This bot is currently designed to work in a single clan (id is hardcoded) by looping over the 30 last messages of the clan chat. Adding this bot id to another clan wont do anything.

**Made by me (aDen)**