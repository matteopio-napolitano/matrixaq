//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/matrixaq';

var dbHelper = function () {

    // database connection instance
    var dbConnection = null;

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection established to', url);
            dbConnection = db;
        }
    });

    this.pushMessage = function(queueName, encodedMessage, callback) {
        if (queueName === null || queueName.length === 0) {
            callback('No queue name specified! Unable to handle this message');
            return;
        }

        if (encodedMessage === null || encodedMessage.length === 0) {
            callback('No message specified!');
            return;
        }

        // Prepare new item
        var message = {
            queue: queueName,
            encodedPayload: encodedMessage,
            createdAt: new Date(),
            dispatchedAt: null,
            dispatchStatus: null
        };

        // Insert
        dbConnection
            .collection('messages')
            .insert(message, function (err, result) {
                if (err) {
                    callback(err);
                    return;
                }

                // send response via callback
                var status = 'The inserted document is: ' + JSON.stringify(result.insertedIds);
                callback(status);
            });
    };

    this.getMessagesToDispatch = function (callback) {
        if (dbConnection === null) {
            console.log('Missing database connection');
            callback([]);
            return;
        }

        dbConnection
            .collection('messages')
            .find({'dispatchedAt': null}).toArray(function(err, results) {
                if (err) {
                    console.log(err);
                    callback([]);
                    return;
                }

                callback(results);
            });
    };

    this.cleanSession = function () {
        // Close connection
        dbConnection.close();
    }
};

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
dbHelper.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
dbHelper.getInstance = function () {
    if (this.instance === null) {
        this.instance = new dbHelper();
    }
    return this.instance;
}

module.exports = dbHelper;
