import { sqlite3 } from 'sqlite3';

function readGame(id) {
    console.log(id);
    return id;
}

export default function (req, res) {
    const { id } = req.query;
    let game = readGame(id);
    return res.status(200).json(game);
}
