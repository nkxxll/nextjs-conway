import sqlite3 from 'sqlite3';
sqlite3.verbose();

export class DBConnection {
    constructor(source) {
        this.dbSource = source;
        this.db = new sqlite3.Database(this.dbSource, sqlite3.OPEN_READWRITE, (err) => {
            if (err && err.code == 'SQLITE_CANTOPEN') {
                console.debug('create database');
                this.createDatabase();
                return;
            } else if (err) {
                console.debug('Getting error ' + err);
                exit(1);
            }
            console.debug('everything is fine the database is there');
        });
    }

    async createDatabase() {
        this.db = new sqlite3.Database(this.dbSource, (err) => {
            if (err) {
                console.debug('Getting error ' + err);
                // todo this is bad
                exit(1);
            }
            let promise = this.createTables();
            return promise;
        });
    }

    async clean() {
        let promise = new Promise((res, rej) => {
            this.db.exec(
                `DELETE FROM GameOfLife;
DELETE FROM sqlite_sequence WHERE name='GameOfLife';`,
                (suc, err) => {
                    if (err) {
                        rej('error cleaning up the db');
                    }
                    res('db is cleaned up' + suc);
                }
            );
        });
        return promise;
    }

    createTables() {
        return new Promise((res, rej) => {
            this.db.exec(
                `CREATE TABLE GameOfLife (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state BLOB,
    extra_data TEXT
);`,
                (stat, err) => {
                    if (err) {
                        rej(new Error('error occured while creating the tables'));
                    }
                    console.debug('created database');
                    res(stat);
                }
            );
        });
    }

    async saveGame(state, extra_data) {
        let promise = new Promise((res, rej) => {
            this.db.run(
                `INSERT INTO GameOfLife (state, extra_data) VALUES (?, ?);`,
                [state, extra_data],
                (err) => {
                    if (err) {
                        rej('error saving new item');
                    }
                    res('inserted fine');
                }
            );
        });
        return promise;
    }

    async getDataByState(state) {
        let promise = new Promise((res, rej) => {
            this.db.get(
                `
select * from GameOfLife where state = ?;
`,
                [state],
                (err, row) => {
                    if (err) {
                        console.debug('get error', err.message);
                        this.db.close();
                        rej(err);
                    }
                    console.debug(row);
                    res(row);
                }
            );
        });
        return promise;
    }

    async getDataByID(id) {
        let promise = new Promise((res, rej) => {
            this.db.get(
                `
select * from GameOfLife where id = ?;
`,
                [id],
                (err, row) => {
                    if (err) {
                        console.debug('get error', err.message);
                        this.db.close();
                        rej(err);
                    }
                    console.debug(row);
                    res(row);
                }
            );
        });
        return promise;
    }

    async close() {
        let promise = new Promise((res, rej) => {
            this.db.close((err) => {
                if (err) {
                    // todo return something helpful here
                    rej("database didn't close correctly");
                }
                res('Database closed');
            });
        });
        return promise;
    }
}
