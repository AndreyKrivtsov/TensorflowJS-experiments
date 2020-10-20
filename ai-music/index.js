const web = require('./web.js');
const TextData = require('./data.js');
const lstm = require('./lstm.js');
const fs = require("fs");

exports = module.exports = () => {
    const startNetwork = true;
    const startTraining = true;
    const startServer = true;
    
    if (startServer) web.run();
    
    //
    // НАСТРОЙКИ
    //
    const sequenceLength = 5;
    const layers = [64];
    const wordLength = 1;
    const learningRate = 0.01; // loss<3=>0.005 loss<2=>0.003 loss<1=>0.002 loss<0.5=>0.001 // default: 0.001
    const epochsCount = 300;
    const batchSize = 256; // default: 32
    const verbose = 1; // default: 1
    const generateLength = 100;
    const minLoss = 0.01;
    //
    //
    //
    
    const data = new TextData(fs)
    data.init('./ai-music/datasets/data.txt');
    
    if (startNetwork) {
    
        lstm.create(layers, sequenceLength, data.dictLength, wordLength, learningRate);
        lstm.setData(data.sequence);
    
        if (startTraining) {
            web.started = true;
    
            let startTime = Date.now();
            lstm.train(epochsCount, batchSize, verbose,
    
                (epoch, logs, model) => {
                    if (logs.loss < 3) {
                        model.optimizer.learningRate = 0.005;
                    }
    
                    if (logs.loss < 2) {
                        model.optimizer.learningRate = 0.003;
                    }
    
                    if (logs.loss < 1) {
                        model.optimizer.learningRate = 0.002;
                    }
    
                    if (logs.loss < 0.5) {
                        model.optimizer.learningRate = 0.001;
                    }
    
                    saveLog(logs);
    
                    if (!web.started || logs.loss < minLoss) {
                        console.log('Stopped training.');
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
    
                    let index = data.maxIndex(prediction);
                    for (let j = 0; j < output.length-1; j++) output[j][0] = output[j+1][0];
    
                    output[output.length-1][0] = index / (data.dictLength - 1);
                    process.stdout.write((data.idxToChar[index]));
                    predictArr.push(endPredict - startPredict);
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
        let data = fs.readFileSync("./ai-music/log.txt", "utf8");
        fs.writeFile("./ai-music/log.txt", data + jlog + '\n', function(error){
            if(error) throw error;
        });
    }
    
}