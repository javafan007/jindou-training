
const getDBService = require('../db/index');

class BaseService {

    constructor (colName) {
        this.colName = colName;
    }

    async save (entity) {
        const dbService = await dbPromise;
        dbService.get
    }

    async _wrapper () {
        const dbService = await getDBService();
        dbService.collection(this.colName)
    }
}