const { MongoClient } = require('mongodb')

let dbConnection;
const uri = "mongodb://localhost:27017/bookstore"
module.exports = {
    connectToDb: (cb) => {
        // mongodb://localhost:27017
        MongoClient.connect(uri)
            .then((client) => {
                dbConnection = client.db();
                return cb();
            })
            .catch((err) => {
                console.log("DB Error===>", err)
                return cb(err)
            })
    },

    getFromDb: () => dbConnection,
}