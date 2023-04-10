import React from "react";
import { useSelector } from "react-redux";
import { selectUsersById } from "./usersApiSlice";
import { TableRow, TableCell, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const User = ({ userId }) => {
  const user = useSelector((state) => selectUsersById(state, userId));
  const navigate = useNavigate();
  if (user) {
    const handleEdit = () => navigate(`/dash/users/${userId}`);
    const userRoleString = user.roles.toString().replaceAll(",", ", ");

    return (
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {user.username}
        </TableCell>
        <TableCell>{userRoleString}</TableCell>
        <TableCell align="right">
          <Button color="secondary">
            <FontAwesomeIcon icon={faPenToSquare} onClick={handleEdit} />
          </Button>
        </TableCell>
      </TableRow>
    );
  } else return null;
};

export default User;
