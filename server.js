// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Sets up the Express App
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static( __dirname));

// Routes

// Routes to Notes page:
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// Returns stored notes
app.get('/api/notes', (req, res) => res.json(JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')))));

// Route to POST new note:
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    let noteList = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
    noteList.push(newNote);
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(noteList));
    res.json(newNote);
});

// Route to DELETE new note:
app.delete('/api/notes/:id', (req, res) => {
    const removeId = req.params.id;
    let noteList = JSON.parse(fs.readFileSync(path.join(__dirname, '/db/db.json')));
    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i].id === removeId) {
            noteList.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(path.join(__dirname, '/db/db.json'), JSON.stringify(noteList));
    res.sendStatus(200);
});

// Routes to Index:
app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

// Starts the server to begin listening
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
