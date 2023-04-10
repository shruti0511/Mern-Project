import React from "react";
import Note from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  TableBody,
  Container,
  Typography,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";

const NoteList = () => {

  const { username, isAdmin, isManager } = useAuth();
  const {
    data: notes,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetNotesQuery('notesList', {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });


  let content;
  if (isLoading) {
    content = <TableRow><TableCell>Loading...</TableCell></TableRow>;
  }
  if (isError) {
    content = <TableRow><TableCell>{error?.data?.message}</TableCell></TableRow>;
  }

  if (isSuccess) {
    const { ids, entities } = notes;
    let filteredIds;
    if (isAdmin || isManager) {
      filteredIds = [...ids]
    }
    else {
      filteredIds = ids.filter(noteId => entities[noteId].username === username)
    }
    const tableContent = ids?.length && filteredIds.map(noteId => <Note key={noteId} noteId={noteId} />)

    content = (
      <>
        {tableContent}
      </>
    );
  }

  return (
    <Container>
      <Typography variant="h5" sx={{ margin: 1 }}>
        NotesList
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ minWidth: 500, maxWidth: 1200, margin: 5 }}
      >
        <Table sx={{ minWidth: 400 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Text</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{content}</TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default NoteList;
