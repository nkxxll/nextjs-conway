import { DBConnection } from '../../../lib/db';

const conn = new DBConnection('./games.db');

// this takes a post
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
    let body = req.body;
    if (body.state === null && typeof body.state === 'string') {
        res.status(400).send({ message: 'bad post request' });
        return;
    }
    if (body.extra_data === null) {
        console.warn('extra_data was null this is suss');
    }
    conn.saveGame(body.state, body.extra_data);
    return res.status(200).json('OK');
}
