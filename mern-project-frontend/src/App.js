import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import DashLayout from "./components/DashLayout"
import Welcome from "./features/auth/Welcome"
import NoteList from "./features/Notes/NoteList"
import UserList from "./features/users/UserList"
import EditUser from "./features/users/EditUser"
import EditNote from "./features/Notes/EditNote"
import NewNote from "./features/Notes/NewNote"
import NewUserForm from "./features/users/NewUserForm"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import { ROLES } from "./config"
import RequireAuth from "./features/auth/RequireAuth"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        {/* Protected Route */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NoteList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>
              </Route> {/* dash end */}
            </Route>{/* prefetch end */}
          </Route> {/* Reuite Auth end */}
        </Route> {/* persist login end */}
        {/* End Protected Route */}
      </Route>
    </Routes>
  )
}

export default App
