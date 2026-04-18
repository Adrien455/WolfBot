const { add_member, remove_member, change_leader, promote, demote } = require('../services/clan');
const { send_message } = require('../api/message');

async function log_handler(context, log)
{
       console.log(log);

       switch(log.action)
       {
            case "JOIN_REQUEST_ACCEPTED":
                add_member(context, log.targetPlayerId, { name: log.targetPlayerUsername });
                return send_message(context, `Welcome ${log.targetPlayerUsername} !`);

            case "PLAYER_JOINED":
                add_member(context, log.playerId, { name: log.playerUsername });
                return send_message(context, `Welcome ${log.playerUsername} !`);

            case "PLAYER_LEFT":
                remove_member(context, log.playerId);
                break;

            case "PLAYER_KICKED":
                remove_member(context, log.targetPlayerId);
                break;

            case "LEADER_CHANGED":
                change_leader(context, log.targetPlayerId, log.playerId);
                break;

            case "CO_LEADER_PROMOTED":
                promote(context, log.targetPlayerId);
                break;

            case "CO_LEADER_DEMOTED":
                demote(context, log.targetPlayerId);
                break;

            case "CO_LEADER_RESIGNED":
                demote(context, log.playerId);
                break;
        }
}

module.exports = log_handler;