//const { send_message } = require('../api/message'); CIRCULAR DEP handle error module ??

class BotError extends Error
{
    constructor(message, log_message, url)
    {
        super(message);
        this.log_message = log_message;
        this.url = url;
    }

    /*async handle(context)
    {
        if(this.log_message)
        {
            console.log(this.log_message);
        }

        if(this.message)
        {        
            await send_message(context, this.message)
                .catch(err => console.log(err.log_message));
        }
    }*/
}

module.exports = BotError;