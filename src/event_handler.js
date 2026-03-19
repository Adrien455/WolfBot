const { sendMessage } = require('./message');

async function command_handler(command)
{
    const unknown = async () => await sendMessage("Error: unknown command");

    const commands = 
    {
        greet: async () => await sendMessage("Beep Beep I'm a bot.")   // add commands here
    };

    await (commands[command] || unknown)();
}

module.exports = command_handler;