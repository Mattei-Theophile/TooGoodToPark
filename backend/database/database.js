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
}

exports.Database = Database