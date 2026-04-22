const fs = require("fs");
const path = require("path");

const { get_member } = require('../services/clan_manager');
const { DEVS_IDS } = require('../config');

const commands = new Map();

function load_commands(dir)     // loads modules in specified directory and add them to commands
{
    const files = fs.readdirSync(path.join(__dirname, dir));

    for (const file of files) {
        const cmd = require(`./${dir}/${file}`);
        commands.set(cmd.name, cmd);
    }
}

load_commands("../commands");
load_commands("../test_commands");

async function execute(context, command, player_id, args)    // checks perms
{
    if (command.dev && !DEVS_IDS.includes(player_id))
    {
        throw new Error("Auth Error:\nYou are not allowed to use this command");
    }

    if (command.strict)
    {
        const member = get_member(context, player_id);

        if(!member.coleader && !member.leader)
        {
            throw new Error("Auth Error:\nYou are not allowed to use this command");
        }
    }

    return await command.execute(context, player_id, ...args);
}

async function command_handler(context, message)
{
    const args = message.msg.slice(1).trim().split(/ +/);
    const name = args.shift().toLowerCase();
    const player_id = message.playerId;

    const command = commands.get(name);

    if(!command)
    {
        throw new Error("Input Error: Unknown command.")
    }

    return await execute(context, command, player_id, args);
    
}

module.exports = command_handler;