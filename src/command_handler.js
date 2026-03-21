const fs = require("fs");
const path = require("path");

const { sendMessage } = require('./services/message');
const { get_vips } = require('./services/clan');
const { DEV_ID } = require('./config');

const commands = new Map();

function load_commands(dir)
{
    const files = fs.readdirSync(path.join(__dirname, dir));

    for (const file of files) {
        const cmd = require(`./${dir}/${file}`);
        commands.set(cmd.name, cmd);
    }
}

load_commands("commands");
load_commands("test_commands");

async function execute(command, player_id, args)
{
    if (command.dev && player_id !== DEV_ID)
    {
        return "Error: You are not allowed to use this command";
    }

    if (command.strict && !get_vips().includes(player_id))
    {
        return "Error: You are not allowed to use this command";
    }

    return await command.execute(player_id, args);
}

async function command_handler(message)
{
    const args = message.msg.slice(1).trim().split(/ +/);
    const name = args.shift().toLowerCase();    // may add command arguments later
    const player_id = message.playerId;

    const command = commands.get(name);

    if(!command)
    {
        await sendMessage("Error: unknown command");
        console.log("unknown command");
        return;
    }

    const response = await execute(command, player_id, args);
    console.log("Response:", response);

    if(typeof response === "string" && response.startsWith("Error"))
    {
        await sendMessage(response);    // might hide initial error if sendMessage fails
    }   
}

module.exports = command_handler;