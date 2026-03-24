const { update_balance } = require('../services/clan');

async function ledger_handler(transaction)
{
       console.log(transaction);

       switch(transaction.type)
       {
              case "DONATE":
                     update_balance(transaction.playerId, transaction.gold);
                     break;
       }
}

module.exports = ledger_handler;