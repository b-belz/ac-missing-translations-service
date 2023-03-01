const mysql = require("mysql2");

class Database {
    static connection;

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'benedictbelz',
            password: 'zn79wYRA7jENukW2',
            database: 'development',
        });
        this.start();
    }

    start() {
        this.connection.connect();
    }

    get() {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM missingtranslations`,
                (error, results) => {                                                
                    if (error || results === undefined) {
                        reject(new Error('Connection failed, could not get database.'));
                    } else{
                        resolve(results);
                    }
                }
            );
        });
    }

    select(i18nKey) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT * FROM missingtranslations WHERE i18nKey=?`,
                [i18nKey],
                (error, results) => {                                                
                    if (error || results === undefined) {
                        reject(new Error('Connection failed, could not select values in database.'));
                    } else{
                        resolve(results);
                    }
                }
            );
        });
    }

    insert(i18nKey, customerId, count) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO missingtranslations (i18nKey, customerId, count) VALUES (?, ?, ?)`,
                [i18nKey, customerId, count],
                (error, results) => {                                                
                    if (error || results === undefined) {
                        reject(new Error('Connection failed, could not insert values in database.' + error));
                    } else{
                        resolve(results);
                    }
                }
            );
        });
    }

    update(id, count) {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `UPDATE missingtranslations SET count=? WHERE id=?`,
                [count, id],
                (error, results) => {                                                
                    if (error || results === undefined) {
                        reject(new Error('Connection failed, could not update values in database.'));
                    } else{
                        resolve(results);
                    }
                }
            );
        });
    }

    end() {
        this.connection.end();
    }
}

module.exports = new Database;
