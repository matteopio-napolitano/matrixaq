const async = require('async');
const process = require('process');

var queueHelper = function () {

    /** the queue object instance */
    var queue = async.queue(function (task, callback) {
        console.log('PID[' + process.pid + '] Received new task: ' + task.name);
        callback();
    }, 10);

    /** setup */
    queue.drain = function () {
        console.log('The queue has finished processing!');
    };

    /** this method allow to push a new task to the queue */
    this.push = function (task, successCallback, errorCallback) {
        queue.push(task, function (err, result) {
            if (err) {
                console.log('helper -> error');
                return errorCallback(err);
            }

            console.log('helper -> success');
            return successCallback(result);
        });
    };
};

module.exports = new queueHelper();
