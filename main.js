const {Blockchain} = require('./blockchain');

let BKT = new Blockchain();
BKT.createTransaction('address1', 'address2', 1000);
BKT.createTransaction('address2', 'address1', 1500);
BKT.minePendingTransactions('minerDev');
console.log(BKT.balanceOfAddress('minerDev'));
//console.log(BKT.isBlockchainValid());
console.log('..................................');
BKT.minePendingTransactions('minerDev');
console.log(BKT.balanceOfAddress('minerDev'));
