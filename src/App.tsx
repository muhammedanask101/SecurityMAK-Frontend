// App.tsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";

import CaseListPage from "@/pages/cases/CaseListPage";
import CaseDetailPage from "@/pages/cases/CaseDetailPage";
import CreateCasePage from "@/pages/cases/CreateCasePage";

import AuthGuard from "@/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";

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
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
