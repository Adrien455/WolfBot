# WolfBot

WolfBot is a Node.js bot made for the game Wolvesville.
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

### Launch bot :

```bash
node app.js
```

## Commands :

### Prefix : `!`

- `!greet` → The bot says hi.

- `!claim` → Select the most voted gold quest. In case of tie the last encountered one will be selected. Does not take votes for shuffle into account.

- `!shuffle` → Suffle available quests.

- `!skip` → Skip waiting time between two quest stages.

- `!extend` → Extend given time for a quest stage.

- `!clear` → Clear cache of available quests, members, and ledger.

## Notes

This bot is currently designed to work in a single clan (id is hardcoded) by looping over the 30 last messages of the clan chat. Adding this bot id to another clan wont do anything.


