const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const JSON_PATH = path.join(__dirname, '../dictionary_raw.json');
const DB_PATH = path.join(__dirname, '../assets/dictionary.db');

// Ensure assets directory exists
if (!fs.existsSync(path.join(__dirname, '../assets'))) {
    fs.mkdirSync(path.join(__dirname, '../assets'));
}

// Remove existing DB if any
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
}

const db = new sqlite3.Database(DB_PATH);

console.log('Reading JSON...');
const rawData = fs.readFileSync(JSON_PATH);
const dictionary = JSON.parse(rawData);

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS dictionary (id INTEGER PRIMARY KEY, word TEXT, definition TEXT)");
    db.run("CREATE INDEX IF NOT EXISTS idx_word ON dictionary(word)");

    const stmt = db.prepare("INSERT INTO dictionary (word, definition) VALUES (?, ?)");

    console.log('Inserting data...');
    let count = 0;

    db.run("BEGIN TRANSACTION");
    for (const [word, definition] of Object.entries(dictionary)) {
        stmt.run(word, definition);
        count++;
        if (count % 5000 === 0) console.log(`Inserted ${count} words...`);
    }
    db.run("COMMIT");

    stmt.finalize();
    console.log('Done.');
});

db.close();
