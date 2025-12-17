import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AccountDeletePage from "./pages/AccountDeletePage.jsx";
import AccountDetailPage from "./pages/AccountDetailPage.jsx";
import AccountFormPage from "./pages/AccountFormPage.jsx";
import AccountsListPage from "./pages/AccountsListPage.jsx";
import AccountsPage from "./pages/AccountsPage.jsx";
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

function App() {
  return (
    <Routes>
      <Route path="/acceso" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="cuentas" element={<AccountsPage />} />
        <Route path="cuentas/lista" element={<AccountsListPage />} />
        <Route path="cuentas/nueva" element={<AccountFormPage />} />
        <Route path="cuentas/:id" element={<AccountDetailPage />} />
        <Route path="cuentas/:id/editar" element={<AccountFormPage />} />
        <Route path="cuentas/:id/eliminar" element={<AccountDeletePage />} />
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
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="reportes/lista" element={<ReportsListPage />} />
        <Route path="reportes/nuevo" element={<ReportFormPage />} />
        <Route path="reportes/:id" element={<ReportDetailPage />} />
        <Route path="reportes/:id/editar" element={<ReportFormPage />} />
        <Route path="reportes/:id/eliminar" element={<ReportDeletePage />} />
        <Route path="notificaciones" element={<NotificationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
