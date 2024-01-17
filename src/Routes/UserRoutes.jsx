
import HomePageUser from "../Views/HomePageUser/HomePageUser";
import Orders from "../Views/Orders/Orders";

const UserRoutes = [
  //umer code for user homepage
  {
    path: "/homepage",
    name: "homepage",
    component: <HomePageUser />,
    layout: "/user",
  },

  {
    path: "/Orders",
    name: "orders",
    component: <Orders />,
    layout: "/user",
  },
];
export default UserRoutes;
