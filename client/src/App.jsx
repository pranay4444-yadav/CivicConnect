import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Issues from "./pages/Issues";
import ReportIssue from "./pages/ReportIssue";
import Community from "./pages/Community";
import IssueDetails from "./pages/IssueDetails";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import "./App.css";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/community" element={<Community />} />
        <Route path="/issues/:id" element={<IssueDetails />} />
        <Route path="/authority" element={<AuthorityDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;