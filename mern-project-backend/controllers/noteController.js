const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

// @desc get all notes
// @route GET/notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().select().lean();
  if (!notes?.length) {
    return res.status(400).json({
      message: "No Notes Found",
    });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );
  res.json(notesWithUser);
});

// @desc create new note
// @route POST/notes
// @access private
const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    res.status(400).json({
      message: "All fields are required",
    });
  }
  const note = await Note.create({ user, title, text });
  if (note) {
    res.status(201).json({
      message: "Note Successfully created",
    });
  } else {
    res.status(400).json({
      message: "Invalid Note data received",
    });
  }
});

// @desc update note
// @route POST/notes
// @access private
const updateNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text ) {
    res.status(400).json({
      message: "All Fields are Required",
    });
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({
      message: "Note not Found",
    });
  }
  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res
    .json({ message: `${updatedNote.title} updated suceessfully` });
});

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: " Note not found" });
  }
  const result = await note.deleteOne();
  res.json({ message: `${result.title} deleted suceessfully` });
});



module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
};
