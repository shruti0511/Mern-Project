import {
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useNavigate } from "react-router-dom";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((pre) => !pre);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      setErrMsg("");
      navigate("/dash");
    } catch (error) {
      if (!error.status) {
        setErrMsg("No Server Response");
      } else if (error.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (error.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(error?.data?.message);
      }
      errRef.current.focus();
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const content = (
    <>
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
        <Typography variant="h4">Employee Login</Typography>
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" sx={{ color: "red" }} ref={errRef}>
            {errMsg}
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
              value={username}
              ref={userRef}
              onChange={onUsernameChanged}
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
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              sx={{
                justifyContent: "left",
                float: "left",
                alignContent: "left",
              }}
              control={<Checkbox checked={persist} onChange={handleToggle} />}
              label="Trust This Device"
            />
          </FormControl>
          <FormControl fullWidth>
            <Button
              variant="contained"
              size="large"
              title="Save"
              type="submit"
              sx={{ my: 1 }}
            >
              Login
            </Button>
          </FormControl>
        </form>
      </Box>
    </>
  );
  return content;
};

export default Login;
