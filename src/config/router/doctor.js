import RouterConfig from "../router"
import Home from "../../views/doctor/Home"
import Appointments from "../../views/doctor/Appointments";
import UserProfile from "../../views/patient/UserProfile"
import AddPatient from "../../views/doctor/AddPatient"


const dDashboardRoutes = [
  {
    path: RouterConfig.doctor.home,
    name: "Home",
    icon: "pe-7s-graph",
    component: Home,
    layout: RouterConfig.doctor.main
  },
  {
    path: RouterConfig.doctor.appointments,
    name: "Appointmemts",
    icon: "pe-7s-graph",
    component: Appointments,
    layout: RouterConfig.doctor.main
  },
  {
    path: RouterConfig.doctor.profile,
    name: "Profile",
    icon: "pe-7s-graph",
    component: UserProfile,
    layout: RouterConfig.doctor.main
  },
  {
    path: RouterConfig.doctor.addPatient,
    name: "AddPatient",
    icon: "pe-7s-graph",
    component: AddPatient,
    layout: RouterConfig.doctor.main
  }
];

export default dDashboardRoutes;