import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import HomePageAdmin from "../../Views/HomePageAdminPage/HomePageAdmin";
import UserNavbar from "../Navbar/UserNavbar";

const Content = ({ sidebarIsOpen, toggleSidebar }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
  </Container>
);

export default Content;
