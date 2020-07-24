const tf = require('@tensorflow/tfjs-node-gpu');
//const tf = require('@tensorflow/tfjs-node');

let Lstm = {

    sequenceLength: Number,
    symbolTableLength: Number,
    xData: null,
    yData: null,
    model: tf.sequential(),

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

                this.model.add(tf.layers.dropout({ rate: 0.2 }));
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

    setData(inputVector) {
        let dataSets = [];
        let dataLabels = [];

        for (let i = 0; i < inputVector.length - this.sequenceLength; i++) {
            dataSets[i] = [];
            dataLabels[i] = [];
            for (let j = i; j < this.sequenceLength+i; j++) {
                if (inputVector[j].length > 1) {
                    let buff = [];
                    for (let k = 0; k < inputVector[j].length; k++) {
                        buff.push(inputVector[j][k] / this.symbolTableLength);
                    }
                    dataSets[i].push([buff]);
                }
                else dataSets[i].push([inputVector[j] / this.symbolTableLength]);
            }
            for (let k = 0; k < this.symbolTableLength; k++) {
                dataLabels[i].push(0);
            }
            dataLabels[i][inputVector[this.sequenceLength + i]] = 1;
        }

        console.log('Кол-во семплов: ', dataSets.length);
        console.log('Кол-во меток: ', dataLabels.length);

        console.log('Семплы: ', dataSets);
        console.log('Метки: ', dataLabels);

        let xbuf = [];
        let ybuf = [];

        for (let i = 0; i < dataSets.length; i++) {
            xbuf.push(dataSets[i]);
            ybuf.push(dataLabels[i]);
        }

        //console.log('X: ', xbuf);
        //console.log('Y: ', ybuf);

        this.xData = tf.tensor3d(xbuf);
        this.yData = tf.tensor2d(ybuf);
    },

    randomData() {
        let randomData = [];
        for (let i = 0; i < this.sequenceLength-1; i++) {
            randomData[i] = [0];
        }
        randomData[this.sequenceLength-1] = [1];
        return randomData;
    },

    train(epochsCount, batchSize, verbose, onTrained) {
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
                    //console.log(epoch + 1, logs.loss);
                },
                onTrainEnd: async () => {
                    onTrained();
                }
            }
        });
    },

    predict(input) {
        let prediction = this.model.predict(tf.tensor3d([input]));
        return prediction.dataSync();
    },

};

exports = module.exports = Lstm;