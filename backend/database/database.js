const mysql = require('mysql2')
const databaseConfig = require('./configDatabase.json')


class Database {
    constructor() {

    }

    connect(){
        return mysql.createConnection({
            host : databaseConfig.Database.host,
            user : databaseConfig.Database.user,
            password : databaseConfig.Database.password,
            database : databaseConfig.Database.database,
        })
    }
    disconnect(mysqlConnection){
        mysqlConnection.destroy()
    }

    /**
     * Convert JavaScript Date or ISO string to MySQL DATETIME format
     * @param {Date|string} date - Date object or ISO string
     * @returns {string} MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
     */
    formatDateForMySQL(date) {
        const d = new Date(date);
        return d.toISOString().slice(0, 19).replace('T', ' ');
    }
}

exports.Database = Database

/*




 */
