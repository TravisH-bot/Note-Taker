const notes = require("express").Router();
const uuid = require("../helpers/uuid");
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require("../helpers/fsUtils");

// GET Route for retrieving all the notes
notes.get("/", (req, res) => {
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

// GET Route for retrieving a specific note
notes.get("/:note_id", (req, res) => {
  const noteId = req.params.note_id;
  readFromFile("./db/notes.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json("No note with that ID");
    });
});

// POST Route for a new note
notes.post("/", (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title: title,
      text: text,
      note_id: uuid(),
    };

    readAndAppend(newNote, "./db/notes.json");
    res.json(`Note added successfully 🍜`);
  } else {
    res.error("Error in adding note");
  }
});

// DELETE route for a specific note
notes.delete("/:note_id", (req, res) => {
  const noteId = req.params.note_id;
  readFromFile("./db/notes.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id !== noteId);
      writeToFile("./db/notes.json", result);
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

module.exports = notes;
