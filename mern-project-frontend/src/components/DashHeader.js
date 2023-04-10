import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

import Tooltip from "@mui/material/Tooltip";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DescriptionIcon from "@mui/icons-material/Description";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [sendLogout, { isLoading, isError, isSuccess, error }] =
        useSendLogoutMutation();

    const { isManager, isAdmin } = useAuth();

    const onClickUserAdd = () => navigate("/dash/users/new");
    const onClickNoteAdd = () => navigate("/dash/notes/new");
    const onClickUsersList = () => navigate("/dash/users");
    const onClickNotesList = () => navigate("/dash/notes");
    const onClickTitle = () => navigate("/dash");
    const onLogOutClicked = () => sendLogout();

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);


    const logoutButtton = (
        <Button color="inherit">
            <Tooltip title="Logout">
                <LogoutIcon onClick={onLogOutClicked} />
            </Tooltip>
        </Button>
    );

    let addUserButtton;
    if (USERS_REGEX.test(pathname)) {
        addUserButtton = (
            <Button color="inherit">
                <Tooltip title="Add User">
                    <PersonAddIcon onClick={onClickUserAdd} />
                </Tooltip>
            </Button>
        );
    }

    let addNoteButtton;
    if (NOTES_REGEX.test(pathname)) {
        addNoteButtton = (
            <Button color="inherit">
                <Tooltip title="Add Note">
                    <NoteAddIcon onClick={onClickNoteAdd} />
                </Tooltip>
            </Button>
        );
    }

    let userListButtton;
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
            userListButtton = (
                <Button color="inherit">
                    <Tooltip title="Show Users">
                        <PeopleIcon onClick={onClickUsersList} />
                    </Tooltip>
                </Button>
            );
        }
    }
    let noteListButtton;
    if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
        noteListButtton = (
            <Button color="inherit">
                <Tooltip title="Show Notes">
                    <DescriptionIcon onClick={onClickNotesList} />
                </Tooltip>
            </Button>
        );
    }

    let headerButttons;
    if (isLoading) {
        headerButttons = <p>Logging Out...</p>
    }else {
        headerButttons = (
            <>
                {addUserButtton}
                {addNoteButtton}
                {userListButtton}
                {noteListButtton}
                {logoutButtton}
            </>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="div" sx={{ flexGrow: 1 }}>
                        <Button color="inherit" size="large" onClick={onClickTitle}>
                            TechNotes
                        </Button>
                    </Typography>
                    {headerButttons}
                </Toolbar>
            </AppBar>
        </Box>
    );
};
export default DashHeader;
