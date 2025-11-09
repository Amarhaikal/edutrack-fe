import Login from "./pages/auth/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./pages/main/Main";
import User from "./pages/user/User";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReferenceDataProvider } from "./contexts/ReferenceDataContext";
import UserForm from "./pages/user/UserForm";
import Profile from "./pages/setting/profile/Profile";
import Refs from "./pages/setting/refs/Refs";
import RoleForm from "./pages/setting/refs/details/RoleForm";
import FacultyForm from "./pages/setting/refs/details/FacultyForm";
import ProgrammeForm from "./pages/setting/refs/details/ProgrammeForm";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedAccess from "./components/UnauthorizedAccess";

// App routes component that uses auth context
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useAuth(); 

  console.log('user', user);
  

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ReferenceDataProvider>
      <BrowserRouter>
        <Routes>
          {/* Root route - redirect based on authentication */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/edutrack" replace />
              ) : (
                <Navigate to="/edutrack/login" replace />
              )
            }
          />

          {/* Main route with nested routes - protected */}
          <Route
            path="/edutrack"
            element={
              isAuthenticated ? (
                <Main />
              ) : (
                <Navigate to="/edutrack/login" replace />
              )
            }
          >
            {/* Default route - shows welcome content */}
            <Route
              index
              element={
                <div style={{ padding: "20px" }}>
                  <h3>Welcome to EduTrack</h3>
                  <p>Select a menu item from the sidebar to navigate.</p>
                </div>
              }
            />

            {/* User route - nested within Main - Administrator only */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/add"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <UserForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/details/:id"
              element={
                <ProtectedRoute allowedRoles={['Administrator']}>
                  <UserForm />
                </ProtectedRoute>
              }
            />

            {/* Profile route - nested within Main */}
            <Route path="settings/profile" element={<Profile/>} />

            {/* Reference Data routes - nested within Main */}
            <Route path="settings/refs" element={<Refs/>} />
            <Route path="settings/refs/role/add" element={<RoleForm/>} />
            <Route path="settings/refs/role/:id" element={<RoleForm/>} />
            <Route path="settings/refs/faculty/add" element={<FacultyForm/>} />
            <Route path="settings/refs/faculty/:id" element={<FacultyForm/>} />
            <Route path="settings/refs/programme/add" element={<ProgrammeForm/>} />
            <Route path="settings/refs/programme/:id" element={<ProgrammeForm/>} />

            {/* Unauthorized access route */}
            <Route path="unauthorized" element={<UnauthorizedAccess />} />
          </Route>

          {/* Login route - redirect if already logged in */}
          <Route
            path="/edutrack/login"
            element={
              isAuthenticated ? (
                <Navigate to="/edutrack" replace />
              ) : (
                <Login />
              )
            }
          />

          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ReferenceDataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
