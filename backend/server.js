const express = require('express');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const dbSource = 'bsodata.db';
const db = new sqlite3.Database(dbSource);

const PORT = 3000;

app.use(cors());
app.use(express.json());

async function openDB() {
    return open({
        filename: "./bsodata.db",
        driver: sqlite3.Database
    });
}

app.use("/uploads", express.static("uploads"));

/*---------------------------
    EVENT ROUTES
---------------------------*/

// GET all events
app.get('/api/events', async (req, res) => {
    let comSelect = 'SELECT * FROM events';
    db.all(comSelect, function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message});
        } else {
            res.status(200).json(result);
        }
    });
});

// GET event by title
app.get('/api/events/:title', async (req, res) => {
    let strTitle = req.params.title;
    let comSelect = 'SELECT * FROM events WHERE title = ?';
    db.get(comSelect, [strTitle], function (err, result) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json({ event: result });
        }
    });
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})