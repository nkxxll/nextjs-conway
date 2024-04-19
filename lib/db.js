// this will be finished let's look at the next.js example for postgres db
// clean up with process.on("SIGTERM", ...close) when done process.exit()
import { sqlite3 } from 'sqlite3';

function createTables(db) {
    db.exec(`
    CREATE TABLE GameOfLife (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state BLOB,
        extra_data TEXT
    );`);
}

function createDatabase() {
    const db = new sqlite3.Database('./mcu.db', (err) => {
        if (err) {
            console.log('Getting error ' + err);
            exit(1);
        }
        createTables(db);
    });
}

function closeDB(db) {
    let res = db.close();
    if (res !== null) {
        console.log('error while trying to close the db');
    }
}

/**
 * @param {int} id id of the game
 */
function openDB() {
    let db = new sqlite3.Database('./mcu.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err && err.code == 'SQLITE_CANTOPEN') {
            let db = createDatabase();
            return db;
        } else if (err) {
            console.log('Getting error ' + err);
            exit(1);
        }
    });
    return db;
}

function BufferToArray(buffer) {
    return new Array(...buffer);
}

function retrieveGame(db, id) {
    /** @type Buffer | undefined */
    let game = db.get(
        `
    SELECT * FROM GameOfLife WHERE id = ?;
    `,
        id,
        (err, row) => {
            if (err) {
                consol.log('error getting game');
                return undefined;
            }
            return row.state;
        }
    );
    return game;
}

/**
 * @param {int} id of the game to get
 * @returns {undefined | Array} the game or null if the game was not found
 */
export function getGame(id) {
    let db = openDB();
    let game = retrieveGame(db, id);
    closeDB(db);
    return game;
}

/**
 * @param {array} state of the game to save
 * @param {string} extra data for the game as a string
 */
export function saveGame(state, extra) {
    // todo
}
