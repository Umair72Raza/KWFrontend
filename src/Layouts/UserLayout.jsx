import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Container, Row } from "reactstrap";
import UserRoutes from "../Routes/UserRoutes";
import { setSocket } from "../Redux/Slices/SocketSlice";
import { useDispatch, useSelector } from "react-redux";
import { checkRole, checkToken } from "../utils";
const User = () => {
  let {  user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token= checkToken();
  useEffect(() => {
    dispatch(setSocket(user));
    return () => {
      if (user) {
        dispatch(setSocket(null)); // Disconnect socket on unmount
      }
    };
  }, []);
  const getRoutes = (UserRoutes) => {
    return UserRoutes.map((prop, key) => {
      if (prop.layout === "/user") {
       
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <>
      <Container fluid  className="mt-8 pb-5">
        <Row className="justify-content-center">
          <Routes>
            {token?<>{getRoutes(UserRoutes)}</>:{}}
           {token != null ? <Route
              path="*"
              element={<Navigate to="/user/homepage" replace />}
            />
            :<>{console.log("token expired")}</>}
          </Routes>
        </Row>
      </Container>
    </>
  );
};

export default User;
