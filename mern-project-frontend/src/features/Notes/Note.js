import React from "react";
import { useSelector } from "react-redux";
import { TableRow, TableCell, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { selectNotesById } from "./notesApiSlice";

const Note = ({ noteId }) => {
  const note = useSelector((state) => selectNotesById(state, noteId));
  const navigate = useNavigate();
  if (note) {
    const handleEdit = () => navigate(`/dash/notes/${noteId}`);
    const createdAt = new Date(note.createdAt).toLocaleString();
    const updatedAt = new Date(note.updatedAt).toLocaleString();

    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>

        {note.completed
          ? <TableCell component="th" scope="row" sx={{ color: 'green' }}>Completed</TableCell>
          : <TableCell component="th" scope="row" sx={{ color: 'red' }} >Open</TableCell>
        }
        <TableCell>{createdAt}</TableCell>
        <TableCell>{updatedAt}</TableCell>
        <TableCell>{note.title}</TableCell>
        <TableCell>{note.text}</TableCell>
        <TableCell>{note.username}</TableCell>
        <TableCell>
          <Button color="secondary">
            <FontAwesomeIcon icon={faPenToSquare} onClick={handleEdit} />
          </Button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

export default Note;
