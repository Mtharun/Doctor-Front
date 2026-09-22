import { createBrowserRouter } from "react-router";
import PrivateRoute from "./Routes/PrivateRoutes";

import PublicLayout from "./components/layout/PublicLayout.jsx";
import PatientLayout from "./components/layout/PatientLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import ServiceDetail from "./Pages/ServiceDetail";
import Doctors from "./Pages/Doctors";
import FAQ from "./Pages/FAQ";
import Contact from "./Pages/Contact";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import NotFound from "./Pages/NotFound";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";

import PatientDashboard from "./Pages/PatientDashboard";
import PatientProfile from "./Pages/PatientProfile";
import BookAppointment from "./Pages/BookAppointment";
import MyAppointments from "./Pages/MyAppointments";
import EmergencyRequest from "./Pages/EmergencyRequest";
import Reports from "./Pages/Reports";

import AdminDashboard from "./Pages/AdminDashboard";
import AdminAppointments from "./Pages/AdminAppointments";
import AdminPatients from "./Pages/AdminPatients";
import AdminPatientDetail from "./Pages/AdminPatientDetail";
import AdminEmergency from "./Pages/AdminEmergency";
import AdminDentists from "./Pages/AdminDentists";
import AdminServices from "./Pages/AdminServices";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "services/:id", Component: ServiceDetail },
      { path: "doctors", Component: Doctors },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: Contact },
      { path: "privacy", Component: Privacy },
      { path: "terms", Component: Terms },
    ],
  },
  { path: "/login", Component: Signin },
  { path: "/signup", Component: Signup },
  {
    path: "/patient",
    element: (
      <PrivateRoute roleRequired="patient">
        <PatientLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", Component: PatientDashboard },
      { path: "profile", Component: PatientProfile },
      { path: "appointments", Component: MyAppointments },
      { path: "book", Component: BookAppointment },
      { path: "emergency", Component: EmergencyRequest },
      { path: "reports", Component: Reports },
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute roleRequired="admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "appointments", Component: AdminAppointments },
      { path: "patients", Component: AdminPatients },
      { path: "patients/:id", Component: AdminPatientDetail },
      { path: "emergency", Component: AdminEmergency },
      { path: "reports", Component: Reports },
      { path: "dentists", Component: AdminDentists },
      { path: "services", Component: AdminServices },
    ],
  },
  { path: "*", Component: NotFound },
]);
