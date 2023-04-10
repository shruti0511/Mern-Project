import React, { useEffect, useState } from "react";
import { useDeleteNoteMutation, useUpdateNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  TextField,
  Box,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ users, note }) => {
  const { isAdmin, isManager } = useAuth()

  const [updateNote, { isLoading, isError, isSuccess, error }] =
    useUpdateNoteMutation();
  const [
    deleteNote,
    { isError: isDelError, isSuccess: isDelSuccess, error: delError },
  ] = useDeleteNoteMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [user, setUser] = useState(note.user);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUser("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserChanged = (e) => setUser(e.target.value);
  const onCompletedChanged = () => setCompleted((pre) => !pre);
  const canSave = [title, text, user].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await updateNote({ id: note.id, title, text, user, completed });
    }
  };
  const onDeleteClicked = async () => {
    await deleteNote({ id: note.id });
  };
  const options = users.map((user) => {
    return (
      <MenuItem key={user.id} value={user.id}>
        {user.username}
      </MenuItem>
    );
  });
  const displayErr = (error?.data?.message || delError?.data?.message) ?? "";
  let deleteButton;
  if (isAdmin || isManager) {
    deleteButton = (
      <Button
        variant="contained"
        title="Save"
        color="error"
        size="large"
        fullWidth
        onClick={onDeleteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </Button>
    )
  }
  const content = (
    <>
      <form className="form" onSubmit={onSaveNoteClicked}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          justifyContent="center"
          display="flex"
          width={350}
          flexDirection="column"
          marginTop={10}
        >
          <Typography variant="subtitle1" sx={{ color: "red" }}>
            {displayErr}
          </Typography>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              label="Note Title"
              margin="normal"
              fullWidth
              name="title"
              id="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleChanged}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              label="Note details"
              margin="normal"
              fullWidth
              name="text"
              type="text"
              id="text"
              value={text}
              onChange={onTextChanged}
            />
          </FormControl>
          <FormControl sx={{ my: 1 }} fullWidth>
            <InputLabel id="users-label">Assigned To</InputLabel>
            <Select
              labelId="user-label"
              id="user"
              value={user}
              onChange={onUserChanged}
              input={<OutlinedInput label="Assigned To" />}
              name="user"
              size="3"
            >
              {options}
            </Select>
          </FormControl>
          <FormControl>
            <FormControlLabel
              sx={{
                justifyContent: "left",
                float: "left",
                alignContent: "left",
              }}
              control={
                <Checkbox checked={completed} onChange={onCompletedChanged} />
              }
              label="Work Complete"
            />
          </FormControl>
          <Stack direction="row" spacing={4} justifyContent={"center"}>
            <Button
              variant="contained"
              size="large"
              title="Save"
              type="submit"
              fullWidth
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </Button>
            {deleteButton}

          </Stack>
        </Box>
      </form>
    </>
  );
  return content;
};

export default EditNoteForm;
