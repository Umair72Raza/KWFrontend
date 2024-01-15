import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";

import SubMenu from "./SubMenu";

const SideBar = ({ isOpen, toggle }) => (
  <div className={classNames("sidebar", { "is-open": isOpen })}>
    <div className="sidebar-header">
      <span color="info" onClick={toggle} style={{ color: "#fff" }}>
        &times;
      </span>
      <h3>Bootstrap Sidebar</h3>
    </div>
    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">
        <NavItem>
          <NavLink className="colorWhite" tag={Link} to={"/admin/allUsers"}>
            <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
            Users
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="colorWhite" tag={Link} to={"/admin/allWorkers"}>
            <FontAwesomeIcon icon={faImage} className="mr-2" />
            Workers
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);


export default SideBar
