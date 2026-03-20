const fs = require("fs");
const path = require("path");
const { sendMessage } = require('./message');

const commands = new Map();

const files = fs.readdirSync(path.join(__dirname, "commands"));

for (const file of files)
{
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
}

async function command_handler(content)
{
    const args = content.trim().split(/ +/);
    const name = args.shift().toLowerCase();

    const command = commands.get(name);

    if(!command)
    {
        await sendMessage("Error: unknown command");
        console.log("unknown command");
        return;
    }

    const response = await command.execute();
    console.log(response);

    if(typeof response === "string" && response.startsWith("Error"))
    {
        await sendMessage(response);    // might hide initial error if sendMessage fails
    }
}

module.exports = command_handler;