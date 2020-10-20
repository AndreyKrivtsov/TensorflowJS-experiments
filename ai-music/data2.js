let fs = require('fs');

let Data = {
    dataSetRaw: null,

    // private
    dataSetVector: [],
    dataSetVectorInt: [],
    symbolTable: [],
    words: [],

    maxWordLength: 0,

    init(dataSetFile) {
        this.dataSetRaw = this.readFile(dataSetFile);
        this.dataSetRaw = this.format();
        //this.symbolTable = this.getSymbolTable();
    },

    readFile(fileName) {
        return fs.readFileSync(fileName, 'utf8',);
    },

    getSymbolTable() {
        if (!this.symbolTable.length) {
            for (let symbol of this.getDataSetVector()) {
                if (this.symbolTable.indexOf(symbol) === -1) {
                    this.symbolTable.push(symbol);
                }
            }
        }
        return this.symbolTable;
    },

    getDataSetVector() {
        if (!this.dataSetVector.length) {
            for (let i = 0; i < this.dataSetRaw.length; i++) {
                this.dataSetVector.push(this.dataSetRaw.charAt(i));
            }
        }
        return this.dataSetVector;
    },

    getDataSetVectorInt() {
        if (!this.dataSetVectorInt.length) {
            for (let i = 0; i < this.getDataSetVector().length; i++) {
                this.dataSetVectorInt.push(this.charToInt(this.getDataSetVector()[i]));
            }
        }
        return this.dataSetVectorInt;
    },

    getDataWords() {
        if (!this.words.length) {
            let wordIterator = 0;
            let word = '';
            for (let i = 0; i < this.dataSetRaw.length; i++) {
                if (!this.isReturn(this.dataSetRaw.charAt(i))) {
                    if (this.dataSetRaw.charAt(i) === ' ') {
                        this.words[wordIterator] = [];
                        for (let j = 0; j < this.getMaxWordLength(); j++) {
                            if (j < word.length) { this.words[wordIterator].push(this.charToInt(word.charAt(j))) }
                            else { this.words[wordIterator].push(0) }
                        }
                        wordIterator++;
                        word = '';
                    }
                    else {
                        word += this.dataSetRaw.charAt(i);
                    }
                }
            }
        }
        return this.words;
    },

    getMaxWordLength() {
        if (!this.maxWordLength) {
            let wordIterator = 0;
            let maxLength = 0;
            let word = '';
            for (let i = 0; i < this.dataSetRaw.length; i++) {
                //if (!this.isReturn(this.dataSetRaw.charAt(i))) {
                    if (this.dataSetRaw.charAt(i) === ' ') {
                        maxLength < word.length ? maxLength = word.length : null
                        wordIterator++;
                        word = '';
                    }
                    else {
                        word += this.dataSetRaw.charAt(i);
                    }
                //}
            }
            this.maxWordLength = maxLength;
        }
        return this.maxWordLength;
    },

    isReturn(char) {
        let ret = ['\r', '\n', '\\', 'r',  '\\', 'n', '-', ':'];
        for (let i = 0; i < ret.length; i++) {
            if (char === ret[i]) return true;
        }
        return false;
    },

    charToInt(char) {
        for (let i = 0; i < this.getSymbolTable().length; i++) {
            if (char === this.getSymbolTable()[i]) {
                return i;
            }
        }

        return '';
    },

    intToChar(charCode) {
        if (this.getSymbolTable()[charCode]){
            return this.getSymbolTable()[charCode];
        }
        return '';
    },

    max(vector) {
        let max = 0;
        let index = null;
        for (let i = 0; i < vector.length; i++) {
            if (vector[i] > max) {
                max = vector[i];
                index = i;
            }
        }
        return index;
    },

    format() {
        return this.dataSetRaw.toLowerCase();
    },
};

exports = module.exports = Data;