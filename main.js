const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data + this.nonce)).toString();
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
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, '9/10/2022', 'Genesis_Block', '0');
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLastestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isBlockchainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentblock = this.chain[i];
            const previousblock = this.chain[i - 1];

            if (currentblock.hash !== currentblock.calculateHash()) {
                return false;
            }

            else if (previousblock.hash !== currentblock.previousHash) {
                return false;
            }
        }
        return true;
    }
}


let BKT = new Blockchain();
console.log('1');
BKT.addNewBlock(new Block(1, '9/10/2022', { amount: 5 }));
console.log('2');
BKT.addNewBlock(new Block(2, '9/10/2022', { amount: 3 }));
// BKT.chain[1].data = { amount: 100 };
// BKT.chain[1].hash = BKT.chain[1].calculateHash();
console.log(`....................................................................................`);
console.log(`isBlockchainValid?     ${BKT.isBlockchainValid()}`);
console.log(`.....................................................................................`);
console.log(JSON.stringify(BKT, null, 2));