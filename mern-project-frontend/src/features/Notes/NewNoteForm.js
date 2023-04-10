import React, { useEffect, useState } from "react";
import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
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
} from "@mui/material";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isError, isSuccess, error }] =
    useAddNewNoteMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUser("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserChanged = (e) => setUser(e.target.value);

  const canSave = [title, text, user].every(Boolean) && !isLoading;

 const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({title,text,user})
    }
  }
  const options = users.map((user) => {
    return (
      <MenuItem key={user.id} value={user.id}>
        {user.username}
      </MenuItem>
    );
  });

  const content = (
    <>
      <form className="form" onSubmit={onSaveNoteClicked}>
        <Box
          marginLeft="auto"
          marginRight="auto"
          justifyContent="center"
          alignItems="center"
          display="flex"
          width={350}
          flexDirection="column"
          marginTop={10}
        >
          <Typography variant="subtitle1" sx={{ color: "red" }}>
            {error?.data?.message}
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
          <FormControl sx={{ m: 1 }} fullWidth>
            <InputLabel id="users-label">User</InputLabel>
            <Select
              labelId="user-label"
              id="user"
              value={user}
              onChange={onUserChanged}
              input={<OutlinedInput label="Users" />}
              name="user"
              size="3"
            >
              {options}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            size="large"
            title="Save"
            type="submit"
            disabled={!canSave}
          >
            <FontAwesomeIcon icon={faSave} />
          </Button>
        </Box>
      </form>
    </>
  )




  return content;
};

export default NewNoteForm;
