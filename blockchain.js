const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.from + this.to + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.from) {
            throw new Error('you cannot sign for others wallet');
        }

        const hashtx = this.calculateHash();
        const sig = signingKey.sign(hashtx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.from === null) return null;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('no signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transcations, previousHash = '') {

        this.timestamp = timestamp;
        this.transactions = transcations;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions + this.nonce)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log('BLOCKMINED:  ' + this.hash);
    }

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}



class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block('9/10/2022', 'Genesis_Block', '0');
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(minerAddress) {
        let newBlock = new Block(Date.now(), this.pendingTransactions);
        newBlock.previousHash = this.getLastestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.pendingTransactions = [new Transaction(null, minerAddress, this.miningReward)];
    }




    addTransaction(transaction) {

        if (!transaction.from || !transaction.to) {
            throw new Error('transaction must include from and to address');
        }
        
        if (!transaction.isValid()) {
            throw new Error('transaction is not valid');
        }

        this.pendingTransactions.push(transaction);
    }

    balanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.from === address) {
                    balance -= trans.amount;
                }
                if (trans.to === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isBlockchainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentblock = this.chain[i];
            const previousblock = this.chain[i - 1];

            if (!currentblock.hasValidTransactions()) {
                return false;
            }

            if (currentblock.hash !== currentblock.calculateHash()) {
                return false;
            }

            if (previousblock.hash !== currentblock.previousHash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;