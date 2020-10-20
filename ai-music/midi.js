let fs = require('fs');
let encoder = require('midiencoder');

let Midi = {

    file: new encoder.File(),
    track: new encoder.Track(),

    generation() {
        this.file.addTrack(this.track);

        this.track.addNote(0, 'c4', 64);
        this.track.addNote(0, 'd4', 64);
        this.track.addNote(0, 'e4', 64);
        this.track.addNote(0, 'f4', 64);
        this.track.addNote(0, 'g4', 64);
        this.track.addNote(0, 'a4', 64);
        this.track.addNote(0, 'b4', 64);
        this.track.addNote(0, 'c5', 64);

        fs.writeFileSync('test.midi', this.file.toBytes(), 'binary');
    },

};

exports = module.exports = Midi;