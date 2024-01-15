/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { FiUser, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../Redux/Slices/userSlice";
import { ChatState } from "../../Context/ChatProvider";
import { IoIosNotifications } from "react-icons/io";
import { SelectChat } from "../../utils";

const AdminNavbar = () => {
  const {
    setShowModal,
    setCopyOfChats,
    OriginalChats,
    notification,
    setNotification,
    setChat,
    setSelectedChat,
  } = ChatState();

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

  const HandleNotificationSelection = (notify) => {
    setSelectedChat(() => SelectChat(notify.chat));
    setChat(notify.chat);
    setNotification(notification.filter((n) => n !== notify));
    setShowModal(true);
  };

  return (
    <>
      <Navbar className="bg-primary w-full" expand="sm" dark container="fluid">
        <NavbarBrand href="/" className="fs-bold">
          KW APP
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className=" gap-3 justify-content-end">
          <Nav
            className=" d-flex flex-row gap-4 justify-content-end mt-1 mb-md-1 align-items-center"
            navbar
          >
            <NavItem className="text-white ">
              <Button color="danger" className="p-1 " onClick={Logout}>
                Logout
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
