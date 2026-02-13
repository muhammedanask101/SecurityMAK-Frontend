import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";

import CaseListPage from "@/pages/cases/CaseListPage";
import CaseDetailPage from "@/pages/cases/CaseDetailPage";
import CreateCasePage from "@/pages/cases/CreateCasePage";
import ProfilePage from "@/pages/ProfilePage";

import AuthGuard from "@/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ===============================
            PUBLIC ROUTES
        =============================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===============================
            PROTECTED ROUTES
        =============================== */}
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          {/* Default redirect */}
          <Route path="/" element={<Dashboard />} />

          {/* CASE ROUTES */}
          <Route path="/cases" element={<CaseListPage />} />
          <Route path="/cases/create" element={<CreateCasePage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />


          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />


        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
