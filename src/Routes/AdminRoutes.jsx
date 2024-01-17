import AdminUsers from "../Views/AdminUsers/AdminUsers";
import AdminWorkers from "../Views/AdminWorkers/AdminWorkers";
import HomePageAdmin from "../Views/HomePageAdmin/HomePageAdmin";
import Services from "../Views/Services/Services";

const AdminRoutes = [
  {
    path: "/homePageAdmin",
    name: "homepageAdmin",
    component: <HomePageAdmin />,
    layout: "/admin",
  },
  {
    path: "/services",
    name: "service",
    component: <Services />,
    layout: "/admin",
  },
  {
    path: "/adminusers",
    name: "adminusers",
    component: <AdminUsers />,
    layout: "/admin",
  },
  {
    path: "/adminworkers",
    name: "adminworkers",
    component: <AdminWorkers />,
    layout: "/admin",
  },
];

export default AdminRoutes;
