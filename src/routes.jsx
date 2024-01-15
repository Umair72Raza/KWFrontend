import ForgetPassword from "./Views/ForgetPassword/ForgetPassword";
import Login from "./Views/Login/Login";
import UserRegister from "./Views/UserRegister/UserRegister";
import NewPassword from "./Views/NewPassword/NewPassword";
import HomePageUser from "./Views/HomePageUser/HomePageUser";
import Orders from "./Views/Orders/Orders";

const routes = [
    {
      path: "/login",
      name: "Login",
      component: <Login />,
      layout: "/auth",
    },
    {
      path: "/register",
      name: "User Register",
      component: <UserRegister ShowServices={false}  />,
      layout: "/auth",
    },
    {
      path: "/Workerregister",
      name: "Worker Register",
      component: <UserRegister ShowServices={true} />,
      layout: "/auth",
    },
    {
      path:"/forgetPassword",
      name:"ForgetPassword",
      component:<ForgetPassword />,
      layout:"/auth"
    },
    {
      path:"/newpassword",
      name:"NewPassword",
      component:<NewPassword />,
      layout:'/auth'
    },



    
    
    
    //umer code for user homepage
    {
      path:"/homepage",
      name:"homepage",
      component:<HomePageUser/>,
      layout:'/user'
      
    },





    
    {
      path:'/Orders',
      name:"orders",
      component:<Orders />,
      layout:'/user'
    },

    



  ];
  export default routes;