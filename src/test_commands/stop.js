
module.exports =
{
    name: "stop",
    description: "Stops the program.",
    strict: false,
    dev: true,

    async execute(context)
    {
        context.running = false;
        await context.storage.flush();
    }
};