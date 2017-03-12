var cron = require('node-cron');
var queueHelper = require('../helper/queueHelper');
var dbHelper = require('../helper/dbHelper');

var cronSvc = function () {
    this.start = function () {
        cron.schedule('*/2 * * * * *', function () {
            console.log('running a task every 2 seconds');

            dbHelper.getInstance().getMessagesToDispatch(function (results) {
                if (results === null || results.length === 0) {
                    console.log('No messages to dispatch');
                    return;
                }

                console.log('There are ' + results.length + ' messages to dispatch');
            });
        });
    };
};

module.exports = new cronSvc();
