module.exports =
{
    name: "price",
    description: "Returns gold / gems required to participate in quest.",
    strict: false,
    dev: false,

    async execute(context)
    {
        return `Required for next quest: ${context.state.required}`;
    }
};