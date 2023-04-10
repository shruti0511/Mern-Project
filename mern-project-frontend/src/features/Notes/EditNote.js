import React from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import { useParams } from "react-router-dom";
import { selectNotesById } from "../Notes/notesApiSlice";
import EditNoteForm from "./EditNoteForm";

const EditNote = () => {
  const { id } = useParams()
  const users = useSelector(selectAllUsers);
  const note = useSelector((state) => selectNotesById(state, id));
  const content =
    users && note ? (
      <EditNoteForm users={users} note={note} />
    ) : (
      <p>Loading...</p>
    );
  return content
};

export default EditNote;
