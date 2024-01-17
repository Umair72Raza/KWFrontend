import ForgetPassword from "../Views/ForgetPassword/ForgetPassword";
import Login from "../Views/Login/Login";
import NewPassword from "../Views/NewPassword/NewPassword";
import UserRegister from "../Views/UserRegister/UserRegister";


const AuthRoutes = [
    {
      path: "/login",
      name: "Login",
      component: <Login />,
      layout: "/auth",
    },
    {
      path: "/register",
      name: "User Register",
      component: <UserRegister ShowServices={false} />,
      layout: "/auth",
    },
    {
      path: "/Workerregister",
      name: "Worker Register",
      component: <UserRegister ShowServices={true} />,
      layout: "/auth",
    },
    {
      path: "/forgetPassword",
      name: "ForgetPassword",
      component: <ForgetPassword />,
      layout: "/auth",
    },
    {
      path: "/newpassword",
      name: "NewPassword",
      component: <NewPassword />,
      layout: "/auth",
    },
]
export default AuthRoutes;