import OTPVerification from "../Components/OTPVerification/OTPVerification";
import EditProfilePage from "../Views/EditProfilePage/EditProfilePage";
import HomePageWorker from "../Views/HomePageWorker/HomePageWorker";

const WorkerRoutes = [
  {
    path: "/workerHomepage",
    name: "workerhomepage",
    component: <HomePageWorker />,
    layout: "/worker",
  },
  {
    path: "/editprofile",
    name: "editprofile",
    component: <EditProfilePage ShowServices={true} />,
    layout: "/worker",
  },
  {
    path: "/otpVerification",
    name: "otpverification",
    component: <OTPVerification />,
    layout: "/worker",
  },
];

export default WorkerRoutes;
