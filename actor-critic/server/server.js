const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Environment = require('./Environment.js')
const EventEmitter = require('events');
const port = 3200

const emitter = new EventEmitter();
const env = new Environment(emitter)

emitter.on('onaction', () => {
    console.log('action: ', env.actor);
    io.emit('state', { state: env.getState(), actor: env.actor })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

http.listen(port, () => {
    console.log('listening on *:' + port)
});

io.on('connection', (socket) => {
    socket.on('getconfig', () => {
        io.emit('config', env.getConfig())
    })
    socket.on('getstate', () => {
        io.emit('state', { state: env.getState(), actor: env.actor })
    })
    socket.on('action', (action) => {
        env.action(action)
    })
});

setInterval(() => {
    env.action(1)
}, 5000)