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
**⚠️ Warning :** This file must stay **confidential**.<br>
You can reset it in game's settings in case of accidental push / any leaks.

### Config.js :

Set users IDs in `config.js` :

```js
const OWNER_ID = "OWNER_ID";
const DEVS_IDS = [
    "DEV_ID1",
    "DEV_ID2",
] 
```

You can retrieve IDs using https://api.wolvesville.com/.<br>
See the [documentation](https://api-docs.wolvesville.com/) for the endpoints.

**⚠️ Warning :** Players in `DEVS_IDS` have accessed to **debugging commands** that can modify internal data. Only add trusted members.

### clan_ids.json :

Set authorized clan ids in `clan_ids.json`:

```json
{
    "ids": [
        "id1",
        "id2"
    ]
}
```

This allows you to dynamically manage which clan can use your bot.<br>
Consider it as an additional security layer that takes precedence over the list given by the api.<br>
Adding this bot to a clan in game is consequently not sufficient.<br>
This file is reloaded every 10 minutes.

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

- `!price` → Returns required amount of gold / gems to participate.

### Restricted

Restricted to leader and coleaders.

- `!claim <type>` → 
    - Type can be either gold or gems. Default is gold.
    - Selects the most voted quest (among the selected type).
    - In case of tie the **first encountered** one will be selected.
    - Does not take votes for shuffle into account. 
    - Updates member participation status based on contribution. 
    - Contributions are tracked from bot first start only.
    - If !claim fails required price will not be deduced.

- `!shuffle` → Shuffles available quests.

- `!skip` → Skips waiting time between two quest stages.

- `!extend` → Extends given time for a quest stage.

- `!require <value>` → Change the gold / gems required to participate to a quest. Default value is 500.

## Debugging Commands :

Restricted to players included in `DEVS_IDS`.

- `!give <value>` → Adds specified amount of gold to the balance of a member (in localdata only). Negative values are accepted. Default value is 500 gold.

- `!log` → Logs internal data.

- `!clear` → Clears cached quests and members.

- `!stop` → Stops the bot. Data will be saved locally.

## Notes

- Can run on several clans.

- It relies on **polling** and continuously checks clan messages, clan logs and clan ledger.

- Member data is continuously saved locally. When the bot starts, it loads any existing local data. Changes occuring during offline state / network shutdown are safely retrieved at restart / reconnection.

## Author

Made by **aDen**.