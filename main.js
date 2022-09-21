const {Blockchain,Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('f17edcab2babd99e413579e3b25a6c46e1ce9640e2e0f0946574fb19c36fb4f6');
const myWalletAddress = myKey.getPublic('hex');


let BKT = new Blockchain();
const tx1 = new Transaction(myWalletAddress,'receiver',10);
tx1.signTransaction(myKey);
BKT.addTransaction(tx1);
console.log('starting the miner.......................');
BKT.minePendingTransactions(myWalletAddress);
console.log(`${BKT.balanceOfAddress(myWalletAddress)}`);
//console.log(BKT.isBlockchainValid());
console.log('starting the miner again.......................');
BKT.minePendingTransactions(myWalletAddress);
console.log(BKT.balanceOfAddress(myWalletAddress));
