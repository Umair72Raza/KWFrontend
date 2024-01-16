import AdminUsers from "./Views/AdminUsers/AdminUsers";
import AdminWorkers from "./Views/AdminWorkers/AdminWorkers";
import HomePageAdmin from "./Views/HomePageAdminPage/HomePageAdmin";
import Services from "./Views/Services/Services";


var routes = [
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
    path: '/adminusers',
    name: 'adminusers',
    component: <AdminUsers />,
    layout: '/admin'
  },
  {
    path: '/adminworkers',
    name: 'adminworkers',
    component: <AdminWorkers />,
    layout: '/admin'
  },

];

export default routes;
