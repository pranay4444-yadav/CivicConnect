import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import Community from "./pages/Community";
import IssueDetails from "./pages/IssueDetails";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyIssues from "./pages/MyIssues";

import "./App.css";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(payload.role)
    ) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Invalid token:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/issues"
          element={<Issues />}
        />

        <Route
  path="/my-issues"
  element={
    <ProtectedRoute allowedRoles={["CITIZEN"]}>
      <MyIssues />
    </ProtectedRoute>
  }
/>

        <Route
          path="/issues/:id"
          element={<IssueDetails />}
        />

        <Route
          path="/community"
          element={<Community />}
        />

        {/* Protected Citizen Route */}

        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        {/* Protected Authority/Admin Route */}

        <Route
          path="/authority"
          element={
            <ProtectedRoute
              allowedRoles={["AUTHORITY", "ADMIN"]}
            >
              <AuthorityDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown Routes */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;