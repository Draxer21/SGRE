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
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="cuentas"
          element={
            <ProtectedRoute>
              <AccountsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuentas/lista"
          element={
            <ProtectedRoute>
              <AccountsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuentas/nueva"
          element={
            <ProtectedRoute>
              <AccountFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuentas/:id"
          element={
            <ProtectedRoute>
              <AccountDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuentas/:id/editar"
          element={
            <ProtectedRoute>
              <AccountFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cuentas/:id/eliminar"
          element={
            <ProtectedRoute>
              <AccountDeletePage />
            </ProtectedRoute>
          }
        />
        <Route path="eventos" element={<EventsPage />} />
        <Route path="eventos/lista" element={<EventsListPage />} />
        <Route
          path="eventos/nuevo"
          element={
            <ProtectedRoute>
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="eventos/:id" element={<EventDetailPage />} />
        <Route
          path="eventos/:id/editar"
          element={
            <ProtectedRoute>
              <EventFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="eventos/:id/eliminar"
          element={
            <ProtectedRoute>
              <EventDeletePage />
            </ProtectedRoute>
          }
        />
        <Route path="reservas" element={<ReservationsPage />} />
        <Route path="reservas/lista" element={<ReservationsListPage />} />
        <Route
          path="reservas/nueva"
          element={
            <ProtectedRoute>
              <ReservationFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="reservas/:id" element={<ReservationDetailPage />} />
        <Route
          path="reservas/:id/editar"
          element={
            <ProtectedRoute>
              <ReservationFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservas/:id/eliminar"
          element={
            <ProtectedRoute>
              <ReservationDeletePage />
            </ProtectedRoute>
          }
        />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="reportes/lista" element={<ReportsListPage />} />
        <Route
          path="reportes/nuevo"
          element={
            <ProtectedRoute>
              <ReportFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="reportes/:id" element={<ReportDetailPage />} />
        <Route
          path="reportes/:id/editar"
          element={
            <ProtectedRoute>
              <ReportFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reportes/:id/eliminar"
          element={
            <ProtectedRoute>
              <ReportDeletePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notificaciones"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
