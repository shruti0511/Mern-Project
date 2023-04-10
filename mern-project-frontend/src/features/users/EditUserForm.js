import React, { useEffect, useState } from "react";
import { useDeleteUserMutation, useUpdateUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config";
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

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess,isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRolesChanged = (e) => {
    const {
      target: { value },
    } = e;
    setRoles(typeof value === "string" ? value.split(",") : value);
  };
  const onActiveChanged = () => setActive((pre) => !pre);

  let canSave;
  if (password) {
    canSave =
      [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }
  console.log(validUsername);
  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      // await addNewUser({ username, password, roles });
      if (password) {
        await updateUser({ id: user.id, username, password, roles, active });
      } else {
        await updateUser({ id: user.id, username, roles, active });
      }
    }
  };

  const onDeleteClicked = async () => {
    await deleteUser({id:user.id})

  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <MenuItem key={role} value={role}>
        {role}
      </MenuItem>
    );
  });

  const displayErr = (error?.data?.message || delError?.data?.message) ?? ''

  // const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    // const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    // const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
  const content = (
    <>
      <form className="form" onSubmit={onSaveUserClicked}>
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
              label="Username"
              margin="normal"
              fullWidth
              name="username"
              id="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
              error={!validUsername}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              label="Password"
              margin="normal"
              fullWidth
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={onPasswordChanged}
              error ={password && !validPassword}
            />
          </FormControl>

          <FormControl sx={{ mt: 1 }} fullWidth>
            <InputLabel id="roles-label">Roles</InputLabel>
            <Select
              labelId="roles-label"
              id="roles"
              multiple
              value={roles}
              onChange={onRolesChanged}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
              name="roles"
              size="3"
              error={!Boolean(roles.length)}
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
              control={<Checkbox checked={active} onChange={onActiveChanged} />}
              label="Active"
            />
          </FormControl>

          <Stack direction="row" spacing={4} justifyContent={"center"}>
            <Button
              variant="contained"
              size="large"
              title="Save"
              type="submit"
              disabled={!canSave}
              fullWidth
            >
              <FontAwesomeIcon icon={faSave} />
            </Button>
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
          </Stack>
        </Box>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
