const fs = require("fs");
const path = require("path");

const { send_message } = require('../api/message');
const { get_members } = require('../services/clan');
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

async function execute(command, player_id, args)    // checks perms
{
    if (command.dev && !DEVS_IDS.includes(player_id))
    {
        return "Error: You are not allowed to use this command";
    }

    if (command.strict)
    {
        const member = get_members().get(player_id);

        if(!member.coleader && !member.leader)
        {
            return "Error: You are not allowed to use this command";
        }
    }

    return await command.execute(player_id, ...args);
}

async function command_handler(message)
{
    const args = message.msg.slice(1).trim().split(/ +/);
    const name = args.shift().toLowerCase();
    const player_id = message.playerId;

    const command = commands.get(name);

    if(!command)
    {
        await send_message("Error: unknown command");
        console.log("unknown command");
        return;
    }

    const response = await execute(command, player_id, args);
    console.log("Response:", response);

    if(typeof response === "string" && response.startsWith("Error"))
    {
        await send_message(response);    // might hide initial error if sendMessage fails (chat clan only)
    }   
}

module.exports = command_handler;