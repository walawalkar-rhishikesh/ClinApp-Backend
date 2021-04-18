import RouterConfig from "../router"
import Home from "../../views/patient/Home"
import AddAppointment from "../../views/patient/Schedule"
import Appointment from "../../views/patient/PatientHistory"
import UserProfile from "../../views/patient/UserProfile"



const pDashboardRoutes = [
  {
    path: RouterConfig.patient.home,
    name: "Home",
    icon: "pe-7s-graph",
    component: Home,
    layout: RouterConfig.patient.main
  },
  {
    path: RouterConfig.patient.appointments,
    name: "Appointment",
    icon: "pe-7s-graph",
    component: Appointment,
    layout: RouterConfig.patient.main
  },
  {
    path: RouterConfig.patient.addAppointments,
    name: "AddAppointment",
    icon: "pe-7s-graph",
    component: AddAppointment,
    layout: RouterConfig.patient.main
  },
  {
    path: RouterConfig.patient.profile,
    name: "Profile",
    icon: "pe-7s-graph",
    component: UserProfile,
    layout: RouterConfig.patient.main
  }
];

export default pDashboardRoutes;