
import OTPVerification from "../Views/OTPVerification/OTPVerification"
import EditProfilePage from "../Views/EditProfilePage/EditProfilePage";
import HomePageUser from "../Views/HomePageUser/HomePageUser";
import Orders from "../Views/Orders/Orders";
import PostedJobs from "../Views/PostedJobs/PostedJobs";

const UserRoutes = [
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
  {
    path: "/editprofile",
    name: "editprofile",
    component: <EditProfilePage ShowServices={false} />,
    layout: "/user"
  },
  {
    path: "/otpVerification",
    name: "otpverification",
    component: <OTPVerification />,
    layout: "/user",
  },
  {
    path: "/postedJobs",
    name: "postedJobs",
    component: <PostedJobs />,
    layout: "/user",
  },

];
export default UserRoutes;
