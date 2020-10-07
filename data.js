class TextData {
    constructor(fs) {
      this.fs = fs
      this.dictLength = 0
      this.charToIdx = {}
      this.idxToChar = {}
      this.sequence = []
    }

    init(file) {
        let text = this.readFile(file);
        [this.sequence, this.charToIdx, this.idxToChar] = this.getSequence(text);
    }

    readFile(file) {
        let text = this.fs.readFileSync(file, 'utf8',)
        return text.toLowerCase();
    }

    getSequence(text) {
        let chars = text.split('');
        let dict = []

        for (let char of chars) {
            if (dict.indexOf(char) === -1) {
                dict.push(char);
            }
        }

        this.dictLength = dict.length;

        let charToIdx = {}
        dict.forEach((char, i) => {
            charToIdx[char] = i;
        })
        
        let idxToChar = {}
        dict.forEach((char, i) => {
            idxToChar[i] = char;
        })

        let sequence = []
        chars.forEach((char, i) => {
            sequence.push(charToIdx[char])
        })

        return [sequence, charToIdx, idxToChar];
    }

    isReturn(char) {
        let ret = ['\r', '\n', '\\', 'r',  '\\', 'n', '-', ':'];
        for (let i = 0; i < ret.length; i++) {
            if (char === ret[i]) return true
        }
        return false
    }
}

exports = module.exports = TextData;