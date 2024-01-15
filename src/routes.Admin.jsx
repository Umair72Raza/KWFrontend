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

];

export default routes;
