import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
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

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRolesChanged = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <MenuItem key={role} value={role}>
        {role}
      </MenuItem>
    );
  });



  const content = (
    <>
      <form className="form" onSubmit={onSaveUserClicked}>
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
              label="Username"
              margin="normal"
              fullWidth
              name="username"
              id="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
              error ={!validUsername}
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
              error ={!validPassword}
            />
          </FormControl>
          <FormControl sx={{ m: 1 }} fullWidth>
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
              error ={!Boolean(roles.length)}
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
  );

  return content;
};
export default NewUserForm;
