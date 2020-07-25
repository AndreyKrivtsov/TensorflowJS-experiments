const web = require('./web.js');
const data = require('./data.js');
const lstm = require('./lstm.js');

const startNetwork = true;
const startTraining = true;
const startServer = false;

if (startServer) web.run();

//
// НАСТРОЙКИ
//
const sequenceLength = 60;
const layerSize1 = 64;
const layerSize2 = 32;
const layerSize3 = 64;
const wordLength = 1; //data.getMaxWordLength();
const learningRate = 0.001; // default: 0.001
const epochsCount = 100;
const batchSize = 512 + 256 + 128; // default: 32
const verbose = 1; // default: 1
const generateLength = 1000;
const minLoss = 0.1;
//
//
//

data.init('./datasets/code.txt');
const inputVector = data.getDataSetVectorInt();
//const inputVector = data.getDataWords();
const symbolTableLength = data.getSymbolTable().length;

//console.log('Макс длина слова: ', data.getMaxWordLength());
//console.log(data.getDataWords());
console.log('Длина таблицы символов : ', symbolTableLength);
console.log('Длина тренировочного вектора : ', inputVector.length);
//console.log('Тренировочного вектор : ', inputVector);

if (startNetwork) {
    let lastLoss = 100;
    let counter = 0;

    lstm.create([layerSize1, layerSize2], sequenceLength, symbolTableLength, wordLength, learningRate);
    lstm.setData(inputVector);

    if (startTraining) {
        let startTime = Date.now();
        lstm.train(epochsCount, batchSize, verbose,

            (epoch, logs, model) => {
                logs.loss > lastLoss ? counter++ : counter--;
                counter < 0 ? counter = 0 : null;
                lastLoss = logs.loss;

                if (Number(logs.loss) < minLoss || counter > 3) {
                    console.log('Stopped training by loss.');
                    model.stopTraining = true;
                }
            },

            () => {
            let endTime = Date.now();
            console.log('Время обучения: ', Math.ceil((endTime - startTime) / 1000 / 60));
            console.log('Генерация текста...');

            let startGen = Date.now();
            let output = lstm.randomData();

            for (let i = 0; i < generateLength; i++) {
                let prediction = lstm.predict(output);
                let index = data.max(prediction);
                for (let j = 0; j < output.length-1; j++) {
                    output[j][0] = output[j+1][0];
                }
                output[output.length-1][0] = index / symbolTableLength;
                process.stdout.write((data.intToChar(index)).toString());
                //str += data.intToChar(index);
            }
            process.stdout.write('\n');
            let endGen = Date.now();
            console.log('Время генерации: ', Math.ceil((endGen - startGen) / 1000 / 60));
        });
    }
}