import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import useAuth from "../hooks/useAuth";

import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";

const DashFooter = () => {
  const { username, status } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton;
  if (pathname !== "/dash") {
    goHomeButton = (
      <BottomNavigationAction
        label="Home"
        icon={<Home />}
        onClick={onGoHomeClicked}
      />
    );
  }

  const content = (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation showLabels sx={{ justifyContent: "left" }}>
        {goHomeButton}

        <BottomNavigationAction label={`Current User: ${username}`} />
        <BottomNavigationAction label={`Status: ${status}`} />
      </BottomNavigation>
    </Paper>
  );

  return content;
};

export default DashFooter;
