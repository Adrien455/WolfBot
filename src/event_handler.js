const fs = require("fs");
const path = require("path");

const { sendMessage } = require('./services/message');
const { get_vips } = require('./services/clan');

const commands = new Map();

const files = fs.readdirSync(path.join(__dirname, "commands"));

for (const file of files)
{
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
}

async function execute(command, player_id)
{
    if(command.strict)
    {
        if(get_vips().includes(player_id))
        {
            return await command.execute();
        }
        else
        {
            return "Error: You are not allowed to use this command";
        }
    }
    else
    {
        return await command.execute();
    }
}

async function command_handler(message)
{
    const args = message.msg.slice(1).trim().split(/ +/);
    const name = args.shift().toLowerCase();    // may add parser later
    const player_id = message.playerId;

    const command = commands.get(name);

    if(!command)
    {
        await sendMessage("Error: unknown command");
        console.log("unknown command");
        return;
    }

    const response = await execute(command, player_id);
    console.log(response);

    if(typeof response === "string" && response.startsWith("Error"))
    {
        await sendMessage(response);    // might hide initial error if sendMessage fails
    }   
}

module.exports = command_handler;