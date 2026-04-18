const { update_balance } = require('../services/clan_manager');

async function ledger_handler(context, transaction)
{
       console.log(transaction);

       switch(transaction.type)
       {
              case "DONATE":
                     update_balance(context, transaction.playerId, transaction.gold);
                     break;
       }
}

module.exports = ledger_handler;