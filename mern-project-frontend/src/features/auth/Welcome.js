import { Container } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("en-In", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);
  const { username, isAdmin, isManager } = useAuth();

  const content = (
    <section>
      <Container>
        <p>{today.toLocaleLowerCase()}</p>

        <h1>WelCome! {username}</h1>

        <p>
          <Link to="/dash/notes">View TechNotes</Link>
        </p>
        <p>
          <Link to="/dash/notes/new">Add New TechNotes</Link>
        </p>
        {(isManager || isAdmin) && (
          <>
            <p>
              <Link to="/dash/users">View User Settings</Link>
            </p>
            <p>
              <Link to="/dash/users/new">Add New Users</Link>
            </p>
          </>
        )}
      </Container>
    </section>
  );
  return content;
};

export default Welcome;
