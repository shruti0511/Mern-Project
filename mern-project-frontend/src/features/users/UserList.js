import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import { TableContainer,Table, TableRow, TableCell,Paper,TableHead,TableBody, Container, Typography } from '@mui/material'
import User from './User'
import { Link } from 'react-router-dom'

const UserList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery('usersList', {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  let content
  if (isLoading) {
    content = <p>Loading...</p>
  }
  if (isError) {
    content = <p>{error?.data?.message}</p>
  }
  if (isSuccess) {
    const {ids} = users
    const tableContent = ids?.length !==0
      ? ids.map(userId => <User key={userId} userId={userId}/>)
      :null

    content = (
      <>
      {tableContent}
      </>
    )
  }


  return (
    <Container>
      <Typography variant='h5' sx={{margin:1}}>UserList</Typography> <Link to="new">Add</Link>
      <TableContainer component={Paper} sx={{ minWidth: 400 , maxWidth:800, margin:5 }}>
      <Table sx={{ minWidth: 400}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell >Roles</TableCell>
            <TableCell align="right">Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {content}
        </TableBody>
      </Table>
    </TableContainer>
    </Container>

  )
}

export default UserList