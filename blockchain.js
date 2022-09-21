const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
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


    

    createTransaction(from, to, address) {
        var tx = new Transaction(from, to, address);
        this.pendingTransactions.push(tx);
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