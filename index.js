const web = require('./web.js');
const data = require('./data.js');
const lstm = require('./lstm.js');
const fs = require("fs");

const startNetwork = true;
const startTraining = true;
const startServer = true;

if (startServer) web.run();

//
// НАСТРОЙКИ
//
const sequenceLength = 20;
const layers = [64,64,32,32];
const wordLength = 1; //data.getMaxWordLength();
const learningRate = 0.001; // default: 0.001
const epochsCount = 1000;
const batchSize = 1024; // default: 32
const verbose = 1; // default: 1
const generateLength = 200;
const minLoss = 0.1;
//
//
//

data.init('./datasets/data2.txt');
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
    let lossHistory = [];
    let lossHistoryLength = 100;

    lstm.create(layers, sequenceLength, symbolTableLength, wordLength, learningRate);
    lstm.setData(inputVector);

    if (startTraining) {
        web.started = true;

        let startTime = Date.now();
        lstm.train(epochsCount, batchSize, verbose,

            (epoch, logs, model) => {
                //logs.loss > lastLoss ? counter++ : counter--;
                counter < 0 ? counter = 0 : null;
                lastLoss = logs.loss;
                lossHistory.length >= lossHistoryLength ? lossHistory.shift() : 0;
                lossHistory.push(logs.loss);
                Number(logs.loss) < minLoss || counter > 3 ? web.started = false : 0;
                //if (lossHistory.length === lossHistoryLength) Math.max.apply(null, lossHistory) - Math.min.apply(null, lossHistory) < 0.02 ? stop = true : 0;
                saveLog(logs);
                if (!web.started) {
                    console.log('Stopped training by loss.');
                    model.stopTraining = true;
                }
            },

            () => {
            let predictArr = [];
            let endTime = Date.now();
            console.log('Время обучения: ', Math.ceil((endTime - startTime) / 1000 / 60));
            console.log('Генерация текста...');

            let startGen = Date.now();
            let output = lstm.randomData();

            for (let i = 0; i < generateLength; i++) {
                let startPredict = Date.now();
                let prediction = lstm.predict(output);
                let endPredict = Date.now();
                predictArr.push(endPredict - startPredict);
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
            console.log('Времена предсказаний: ', predictArr);
        });
    }
}

function saveLog(log) {
    let jlog = JSON.stringify(log);
    let data = fs.readFileSync("log.txt", "utf8");
    fs.writeFile("log.txt", data + jlog + '\n', function(error){
        if(error) throw error;
    });
}
