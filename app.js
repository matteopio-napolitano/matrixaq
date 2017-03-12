var finalhandler = require('finalhandler');
var http = require('http');
var Router = require('router');

var cronSvc = require('./services/cronSvc');
var dbHelper = require('./helper/dbHelper');

/** Router setup */
var router = Router();
router.get('/message', function (req, res) {
    dbHelper.getInstance().pushMessage('testQueue', 'testMessage', function(response) {
        console.log(response);

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(response);
    });
})

/** Server setup */
var server = http.createServer(function (req, res) {
    router(req, res, finalhandler(req, res));
});
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

/** Cron service setup */
cronSvc.start();

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);

    dbHelper.getInstance().cleanSession();

    console.log('----------------------');
    console.log('Closing MatrixAQ. Bye!');
    process.exit(0);
});

process.on('SIGINT', function() {
    dbHelper.getInstance().cleanSession();

    console.log('----------------------');
    console.log('Closing MatrixAQ. Bye!');
    process.exit(0);
});
