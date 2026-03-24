const { add_member, remove_member, change_leader, promote, demote } = require('../services/clan');
const { send_message } = require('../api/message');

async function log_handler(log)
{
       console.log(log);

       switch(log.action)
       {
            case "JOIN_REQUEST_ACCEPTED":
                add_member(log.targetPlayerId, { name: log.targetPlayerUsername });
                return send_message(`Welcome ${log.targetPlayerUsername} !`);

            case "PLAYER_JOINED":
                add_member(log.playerId, { name: log.playerUsername });
                return send_message(`Welcome ${log.playerUsername} !`);

            case "PLAYER_LEFT":
                remove_member(log.playerId);
                break;

            case "PLAYER_KICKED":
                remove_member(log.targetPlayerId);
                break;

            case "LEADER_CHANGED":
                change_leader(log.targetPlayerId, log.playerId);
                break;

            case "CO_LEADER_PROMOTED":
                promote(log.targetPlayerId);
                break;

            case "CO_LEADER_DEMOTED":
                demote(log.targetPlayerId);
                break;

            case "CO_LEADER_RESIGNED":
                demote(log.playerId);
                break;
        }
}

module.exports = log_handler;