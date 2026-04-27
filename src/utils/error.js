class BotError extends Error
{
    constructor({message, log_message, status})
    {
        super(message);
        this.log_message = log_message;
        this.status = status;
    }
}

module.exports = BotError;