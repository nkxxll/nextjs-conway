import { DBConnection } from '../../../lib/db';
const conn = new DBConnection('./games.db');

async function readGame(id) {
    const res = await conn.getDataByID(id);
    return res;
}

export default async function handler(req, res) {
    const { id } = req.query;
    let game = await readGame(id);
    console.log(game);
    return res.status(200).json(game);
}
