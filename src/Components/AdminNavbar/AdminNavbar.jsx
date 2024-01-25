import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,

  Container,
} from "reactstrap";

import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../Redux/Slices/AuthSlice";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);
  const Logout = async () => {
    const result = await dispatch(logoutAsync());
    if (result.type === "auth/logout/fulfilled") {
      navigate("/auth/login");
    }
  };


  return (
    <Container>
      <Navbar className="bg-primary w-full" expand="sm" dark container="fluid">
        <NavbarBrand style={{ paddingLeft: "5%" }} href="/" className="fs-bold">
          KW APP
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className=" gap-3 justify-content-end">
          <Nav
            className=" d-flex flex-row gap-4 justify-content-end mt-1 mb-md-1 align-items-center"
            navbar
          >
            <NavItem style={{ paddingRight: "45%" }} className="text-white ">
              <Button color="danger" className="p-1" onClick={Logout}>
                Logout
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  );
};

export default AdminNavbar;
