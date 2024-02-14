import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";

const SidebarWorker = () => {
  return (
    <div className="sidebar p-4">
      <Nav vertical>
        <NavItem>
          <NavLink tag={Link} to="/worker/overview">
            Overview
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/worker/tasks">
            Tasks
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to="/worker/profile">
            Profile
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
};

export default SidebarWorker;
