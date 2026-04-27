

module.exports =
{
    name: "stop",
    description: "Stops the processed clan.",
    strict: false,
    dev: true,

    async execute(context)
    {
        context.running = false;
    }
};