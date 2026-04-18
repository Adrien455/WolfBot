
module.exports =
{
    name: "log",
    description: "Logs members DB",
    strict: false,
    dev: true,

    async execute(context)
    {
        console.log("Clan Id: ", context.id);
        console.log("Members :", context.state.members);
        console.log("Required :", context.state.required, "\n");
    }
};