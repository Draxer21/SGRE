import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ReservationsPage from "./pages/ReservationsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/acceso" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="eventos" element={<EventsPage />} />
        <Route path="reservas" element={<ReservationsPage />} />
        <Route path="reportes" element={<ReportsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
