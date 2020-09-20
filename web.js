let app = require('express')();
let web = require('http').Server(app);

let Web = {
    status: {},
    started: false,

    run() {
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/lstm.html');
        });

        app.get('/status', function (req, res) {
            res.send('started ' + this.started)
        });

        app.get('/stop', (req, res) => {
            this.started = false;
            res.send('started ' + this.started)
        });

        var port = process.env.PORT || 3000;
        web.listen(port, function () {
            console.log('listening web server');
        });
    }
};

exports = module.exports = Web;
