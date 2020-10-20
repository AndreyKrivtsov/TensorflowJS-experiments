var io  = require('socket.io-client');
var client = io.connect('http://localhost:3200');

client.on('state', (state) => {
    console.log(state.actor)
})

client.emit('action', 2);

//client.emit('getstate');