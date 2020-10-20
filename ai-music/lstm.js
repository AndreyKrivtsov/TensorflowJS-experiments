const tf = require('@tensorflow/tfjs-node-gpu');
//const tf = require('@tensorflow/tfjs-node');

let Lstm = {

    sequenceLength: Number,
    symbolTableLength: Number,
    xData: null,
    yData: null,
    model: tf.sequential(),
    log: [],

    // ИНИЦИАЛИЗАЦИЯ СЕТИ И СЛОЕВ
    create(layers, sequenceLength, symbolTableLength, wordLength, learningRate) {
        this.sequenceLength = sequenceLength;
        this.symbolTableLength = symbolTableLength;
        for (let i = 0; i < layers.length; i++) {
            if (i === 0) {
                this.model.add(
                    tf.layers.lstm({
                        units: layers[i],
                        recurrentInitializer: 'glorotNormal',
                        returnSequences: layers.length > 1,
                        inputShape: [sequenceLength, wordLength]
                    }));

                //this.model.add(tf.layers.dropout({ rate: 0.2, noiseShape : [3] }));
            }
            else {
                if (i !== layers.length-1 ) this.model.add(tf.layers.lstm({ units: layers[i], returnSequences: true }));
                else this.model.add(tf.layers.lstm({ units: layers[i], returnSequences: false }));
            }

        }
        this.model.add(tf.layers.dense({ units: symbolTableLength, activation: 'softmax' }));
        this.model.compile({ loss: 'categoricalCrossentropy', optimizer: tf.train.adam(learningRate), metrics: ['accuracy'] });
        this.model.summary();

        return this.model;
    },

    // ОБРАБОТКА ДАТА СЕТА
    setData(inputVector) {
        let dataSets = [];
        let dataLabels = [];

        inputVector.forEach((c, i, arr) => {
            if (i + this.sequenceLength < arr.length) {
                let set = arr.slice(i, i + this.sequenceLength)
                    .map(item => [item / (this.symbolTableLength - 1)])
                dataSets.push(set)

                let labelIndex = arr[i + this.sequenceLength]
                let label = new Array(this.symbolTableLength)
                    .fill(0, 0, this.symbolTableLength)
                    .map((elem, index) => Number(index === labelIndex))

                dataLabels.push(label)
            }
        })

        //console.log('Семплы: ', dataSets);
        //console.log('Метки: ', dataLabels[0]);

        this.xData = tf.tensor3d(dataSets);
        this.yData = tf.tensor2d(dataLabels);
    },

    // ПОЛУЧЕНИЯ РАНДОМНОГО ПЕРВОГО ВХОДА
    randomData() {
        let randomData = [];
        for (let i = 0; i < this.sequenceLength; i++) {
            randomData[i] = [0];
        }
        randomData[this.sequenceLength-1] = [1];
        return randomData;
    },

    // ТРЕНИРОВКА СЕТИ
    train(epochsCount, batchSize, verbose, onEpochEnd, onTrained) {
        //console.log(tf.layers.Layer.getWeights());
        this.model.fit(this.xData, this.yData, {
            epochs: epochsCount,
            batchSize: batchSize,
            verbose: verbose,
            callbacks: {
                onBatchBegin: async (logs) => {
                    //console.log('Batch ', batchSize);
                },
                onEpochEnd: async (epoch, logs) => {
                    this.setLog(epoch, logs)
                    onEpochEnd(epoch, logs, this.model);
                },
                onTrainEnd: async () => {
                    onTrained();
                }
            }
        });
    },

    // ПОЛУЧЕНИЕ ОТВЕТА СЕТИ
    predict(input) {
        let prediction = this.model.predict(tf.tensor3d([input]));
        return prediction.dataSync();
    },

    getLog() {
        return this.log
    },

    setLog(epoch, logs) {
        logs.epoch = epoch
        this.log.push(logs)
    },
};

exports = module.exports = Lstm;
