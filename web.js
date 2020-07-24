let app = require('express')();
let web = require('http').Server(app);

let Web = {
    run() {
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });

        var port = process.env.PORT || 3000;
        web.listen(port, function () {
            console.log('listening web server');
        });
    }
};

exports = module.exports = Web;