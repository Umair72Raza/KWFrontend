import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./Layouts/AuthLayout";
import UserLayout from "./Layouts/UserLayout";
import { checkRole, checkToken } from "./utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Worker from "./Layouts/WorkerLayout";
import AdminLayout from "./Layouts/AdminLayout";
import { Spinner } from "reactstrap";

function App() {
  const [authenticated, setAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);
  let { loginStatus, user } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const authenticated = checkToken();

      if (isMounted) {
        setAuthenticated(authenticated);

        if (authenticated) {
          const loginRole = checkRole();
          setRole(loginRole);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loginStatus]);

  useEffect(() => {
    setIsLoading(false);
  }, [authenticated, role]);

  let routes;

  if (authenticated && role === "user") {
    routes = (
      <>
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="*" element={<Navigate to="/user/homepage" />} />
      </>
    );
  } else if (authenticated && role === "worker") {
    routes = (
      <>
        <Route path="/worker/*" element={<Worker />} />
        <Route path="*" element={<Navigate to="/worker/workerHomepage" />} />
      </>
    );
  } else if (authenticated && role === "admin") {
    console.log("In Admin condition");
    routes = (
      <>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin/homePageAdmin" />} />
      </>
    );
  } else {
    console.log("In Auth condition", authenticated);
    routes = (
      <>
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </>
    );
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes>{routes}</Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
