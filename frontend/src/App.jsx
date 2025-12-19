import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import RequireRole from "./components/RequireRole.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PublicLandingPage from "./pages/PublicLandingPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AccountDeletePage from "./pages/AccountDeletePage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import AccountFormPage from "./pages/AccountFormPage.jsx";
import AccountsListPage from "./pages/AccountsListPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EventDeletePage from "./pages/EventDeletePage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";
import EventFormPage from "./pages/EventFormPage.jsx";
import EventsListPage from "./pages/EventsListPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ReportDeletePage from "./pages/ReportDeletePage.jsx";
import ReportDetailPage from "./pages/ReportDetailPage.jsx";
import ReportFormPage from "./pages/ReportFormPage.jsx";
import ReportsListPage from "./pages/ReportsListPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import ReservationDeletePage from "./pages/ReservationDeletePage.jsx";
import ReservationDetailPage from "./pages/ReservationDetailPage.jsx";
import ReservationFormPage from "./pages/ReservationFormPage.jsx";
import ReservationsListPage from "./pages/ReservationsListPage.jsx";
import ReservationsPage from "./pages/ReservationsPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function RoleIndexRedirect() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="empty-state">
        <span className="loader" aria-label="Cargando" />
      </div>
    );
  }

  if (role === "consulta") {
    return <Navigate to="eventos" replace />;
  }

  return <Navigate to="dashboard" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/inicio" replace />} />
      <Route path="/inicio" element={<PublicLandingPage />} />
      <Route path="/acceso" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleIndexRedirect />} />
        <Route
          path="dashboard"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <DashboardPage />
            </RequireRole>
          }
        />
        <Route path="perfil" element={<ProfilePage />} />
        <Route
          path="cuentas"
          element={
            <RequireRole roles={["admin"]}>
              <AccountsPage />
            </RequireRole>
          }
        />
        <Route
          path="cuentas/lista"
          element={
            <RequireRole roles={["admin"]}>
              <AccountsListPage />
            </RequireRole>
          }
        />
        <Route
          path="cuentas/nueva"
          element={
            <RequireRole roles={["admin"]}>
              <AccountFormPage />
            </RequireRole>
          }
        />
        <Route
          path="cuentas/:id"
          element={
            <RequireRole roles={["admin"]}>
              <AccountDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="cuentas/:id/editar"
          element={
            <RequireRole roles={["admin"]}>
              <AccountFormPage />
            </RequireRole>
          }
        />
        <Route
          path="cuentas/:id/eliminar"
          element={
            <RequireRole roles={["admin"]}>
              <AccountDeletePage />
            </RequireRole>
          }
        />
        <Route path="eventos" element={<EventsPage />} />
        <Route path="eventos/lista" element={<EventsListPage />} />
        <Route path="eventos/nuevo" element={<EventFormPage />} />
        <Route path="eventos/:id" element={<EventDetailPage />} />
        <Route path="eventos/:id/editar" element={<EventFormPage />} />
        <Route path="eventos/:id/eliminar" element={<EventDeletePage />} />
        <Route path="reservas" element={<ReservationsPage />} />
        <Route path="reservas/lista" element={<ReservationsListPage />} />
        <Route path="reservas/nueva" element={<ReservationFormPage />} />
        <Route path="reservas/:id" element={<ReservationDetailPage />} />
        <Route path="reservas/:id/editar" element={<ReservationFormPage />} />
        <Route path="reservas/:id/eliminar" element={<ReservationDeletePage />} />
        <Route
          path="reportes"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportsPage />
            </RequireRole>
          }
        />
        <Route
          path="reportes/lista"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportsListPage />
            </RequireRole>
          }
        />
        <Route
          path="reportes/nuevo"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportFormPage />
            </RequireRole>
          }
        />
        <Route
          path="reportes/:id"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="reportes/:id/editar"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportFormPage />
            </RequireRole>
          }
        />
        <Route
          path="reportes/:id/eliminar"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <ReportDeletePage />
            </RequireRole>
          }
        />
        <Route
          path="notificaciones"
          element={
            <RequireRole roles={["admin", "editor"]}>
              <NotificationsPage />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
