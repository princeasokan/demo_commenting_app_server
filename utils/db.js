const mongodb = require('mongodb').MongoClient;
const logger = require('./logger')
let _db = null;

async function connect() {
    try {

        // _db = await mongodb.connect('mongodb://localhost:27017/test_report', { useNewUrlParser: true });
        _db = await mongodb.connect('mongodb://localhost:27017/comment_app', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (error) {
        logger.error("DBError", error);
    }
}

const getDb = async () => {
    try {
        if (_db != null) {
            return _db.db();
        } else {
            await connect();
            return _db.db();
        }
    } catch (e) {
        return e;
    }
}

module.exports = { connect, getDb }