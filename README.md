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

### API Key :

Create an .env file at the repository root and put your personal api key:

```env
API_KEY = "MY_API_KEY"
```
**⚠️ Warning :** This file must stay **confidential**. You can reset it in game's settings in case of accidental push / any leaks.

### Config.js :

Set your clan and users IDs in `config.js` :

```js
const CLAN_ID = "MY_CLAN_ID";
const OWNER_ID = "OWNER_ID";
const DEVS_IDS = [
    "DEV_ID1",
    "DEV_ID2",
] 
```

You can retrieve IDs using https://api.wolvesville.com/.<br>
See the [documentation](https://api-docs.wolvesville.com/) for the endpoints.

**⚠️ Warning :** The players included in `DEVS_IDS` have accessed at **debugging commands** that can modify internal data. Only add trusted members.

## Run bot :

```bash
node app.js
```

## Behaviour :

- Greets new members with : `Welcome <member_name> !`.

## Commands :

### Prefix : `!`

- `!greet` → Says hi.

- `!savings` → Returns current savings of the player.

### Restricted

Restricted to leader and coleaders.

- `!claim <type>` → 
    - Type can be either gold or gems. Default is gold.
    - Selects the most voted quest (among the selected type).
    - In case of tie the **last encountered** one will be selected.
    - Does not take votes for shuffle into account. 
    - Updates member participation status based on contribution. 
    - Required amount : Initialized at **500 gold**.
    - Contributions are tracked from bot startup only.

- `!shuffle` → Shuffles available quests.

- `!skip` → Skips waiting time between two quest stages.

- `!extend` → Extends given time for a quest stage.

- `!require <value>` → Change the gold required to participate. Default value is 500 gold.

## Debugging Commands :

Restricted to players included in `DEVS_IDS`.

- `!give <value>` → Adds specified amount of gold to the balance of a member (in localdata only). Negative values are accepted. Default value is 500 gold.

- `!log` → Logs the database of members.

- `!clear` → Clear cached quests and members.

- `!stop` → Stops the program. The data of members will be saved locally.

## Notes

- This bot is currently designed to work in a **single clan** (id is hardcoded).

- It relies on **polling** and continuously checks clan messages, clan logs and clan ledger.

- Adding this bot to another clan will have no effect.

- Member data is continuously saved locally. When the bot starts, it loads any existing local data. Note that changes made while the bot is offline (between shutdown and restart) will not be updated. You can use !clear to update it, but it will reset members balances.

## Structure

```bash
.
├── README.md
├── app.js
├── data
│   └── 
├── package-lock.json
├── package.json
└── src
    ├── api
    │   ├── message.js
    │   └── requests.js
    ├── commands
    │   ├── claim.js
    │   ├── extend.js
    │   ├── greet.js
    │   ├── require.js
    │   ├── savings.js
    │   ├── shuffle.js
    │   └── skip.js
    ├── config.js
    ├── controller.js
    ├── handlers
    │   ├── command_handler.js
    │   ├── ledger_handler.js
    │   └── log_handler.js
    ├── pollers.js
    ├── services
    │   ├── clan.js
    │   └── quest.js
    ├── storage.js
    ├── test_commands
    │   ├── clear.js
    │   ├── give.js
    │   ├── log.js
    │   └── stop.js
    └── utils
        ├── cron.js
        ├── monitoring.js
        └── sleep.js
```

## Author

Made by **aDen**.