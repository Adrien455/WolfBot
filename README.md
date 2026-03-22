# WolfBot

WolfBot is a Node.js bot for the game Wolvesville.
It interacts with clan chat through commands to execute automated tasks.

## Getting started

### Clone repository :

```bash
git clone https://github.com/Adrien455/WolfBot.git
cd WolfBot
```

### Install dependencies :

```bash
npm install
```

## Configuration :

### Api Key :

Create an .env file at the repository root and put your personal api key:

```env
API_KEY = "MY_API_KEY"
```
**⚠️ Warning :** This file is **critical** and must stay **confidential**. You can reset it in game's settings in case of accidental push / any leaks.

### Config.js :

You can set your clan id, owner id, and the devs ids in `config.js` :

```js
const CLAN_ID = "MY_CLAN_ID";
const OWNER_ID = "MY_BOT_ID";
const DEVS_ID = 
[
    "DEV_ID1",
    "DEV_ID2",
    ...
] 
```

You can get your clan / player id with [wolvesville_api](https://api-docs.wolvesville.com/) followed by the proper endpoints either by using postman, `curl` or others.
See the [documentation](https://api-docs.wolvesville.com/) for the endpoints.

**⚠️ Warning :** The players included in `DEVS_IDS` have accessed at debugging commands that can modify the database of the members. Keep it in mind when adding someone in it.

## Launch bot :

```bash
node app.js
```

## Behaviour :

- greet new members with the message `Welcome member_name !`.

## Commands :

### Prefix : `!`

- `!greet` → The bot says hi.

- `!claim` → Select the most voted gold quest. In case of tie the last encountered one will be selected. Does not take votes for shuffle into account. It will also check into each member contribution, and update their participating status. For now the required amount to participate is fixed at 500 gold. The bot starts computing contribution AT LAUCNH. Previous ones wont be taken into account.

- `!shuffle` → Shuffle available quests.

- `!skip` → Skip waiting time between two quest stages.

- `!extend` → Extend given time for a quest stage.

## Debugging Commands :

These commands are strictly reserved to debugging purposes. Only players included in `DEVS_IDS` can use them.

- `!balance` -> Adds 500 gold to the balance of a member in MEMBERS database.

- `!log` -> Logs the MEMBERS database.

- `!clear` → Clear cache of available quests and members.

## Notes

This bot is currently designed to work in a single clan (id is hardcoded) by looping over last messages, logs and ledger. Adding this bot id to another clan wont do anything.

**Made by me (aDen)**