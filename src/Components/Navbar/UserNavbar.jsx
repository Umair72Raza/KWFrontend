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
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { FiMessageCircle } from "react-icons/fi";
import { RiInboxArchiveLine } from "react-icons/ri";
import { NavBar } from "./constants";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "../../Redux/Slices/AuthSlice";
import { ChatState } from "../../Context/ChatProvider";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { SelectChat } from "../../utils";
import OnOffButton from "../OnOffButton/OnOffButton";
import Swal from "sweetalert2";
const UserNavbar = () => {
  const {
    setShowModal,
    setCopyOfChats,
    OriginalChats,
    notification,
    setNotification,
    setChat,
    setSelectedChat,
    offerNotification,
    SetONotification,
    setReceiveMessage,
    setGotOffer,
    userOffering,
    setSelectedChatCompare
  } = ChatState();
  const socket=useSelector((state) => state?.socket?.socket);

  const [isOpen, setIsOpen] = useState(false);
  const [offer, SetShowOffer] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);
  
  const Logout = async () => {
    Swal.fire({
      title: "Are You Sure You want to Logout?",
      showCancelButton: true,
      confirmButtonText: "LogOut",
    }).then(async(result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        await socket?.disconnect();
        const result = await dispatch(logoutAsync());
        if (result.type === "auth/logout/fulfilled") {
          navigate("/auth/login");
        }
      }
    });

  };

  const orders = () => {
    SetShowOffer(!offer);
  };

  const HandleNotificationSelection = (notify) => {
    setSelectedChat(() => SelectChat(notify.chat));
    setSelectedChatCompare(notify.chat)
    setChat(notify.chat);
    setNotification(notification.filter((n) => n !== notify));
    setShowModal(true);
  };

  const HandleOrderSelection = (notify) => {
    SetONotification(offerNotification.filter((n) => n !== notify));
    setGotOffer(true);
    setReceiveMessage(notify);
    SetShowOffer(!offer);
  };

  return (
    <>
      <Navbar className="bg-primary w-full" expand="sm" dark container="fluid">
        <NavbarBrand href="/" className="fs-bold">
          {NavBar.brandName}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className=" gap-3 justify-content-end">
          <Nav
            className=" d-flex flex-row gap-4 justify-content-end mt-1 mb-md-1 align-items-center"
            navbar
          >
            {user.role !== "admin" ? (
              <>
                <NavItem className="fs-3 text-white">
                  <CgProfile onClick={() => navigate("/user/editprofile")} />
                </NavItem>
                <UncontrolledDropdown className=" fs-3" nav inNavbar>
                  <DropdownToggle nav className="d-flex">
                    <div>
                      <IoIosNotifications className=" text-white hover-pointer" />
                    </div>
                    {notification.length > 0 && (
                      <h6>
                        {" "}
                        <div className="position-relative">
                          <Badge color="danger" className=" ">
                            {notification.length}
                          </Badge>
                        </div>
                      </h6>
                    )}
                  </DropdownToggle>
                  <DropdownMenu className=" Z-index" end container="body">
                    {notification.length === 0 ? (
                      <DropdownItem>No new messages</DropdownItem>
                    ) : (
                      notification.map((item, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() => HandleNotificationSelection(item)}
                          className="fw-bold"
                        >
                          New Message: {item.newMessage.sender.firstName}{" "}
                          {item.newMessage.sender.lastName}
                        </DropdownItem>
                      ))
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>

                {user.role == "worker" ? (
                  <NavItem className="text-white fs-3  d-flex">
                    <div>
                      <RiInboxArchiveLine onClick={orders} />
                    </div>
                    {offerNotification.length > 0 && (
                      <h6>
                        {" "}
                        <div className="position-relative pr-3">
                          <Badge color="danger" className=" ">
                            {offerNotification.length}
                          </Badge>
                        </div>
                      </h6>
                    )}
                  </NavItem>
                ) : (
                  []
                )}
                <NavItem className="text-white fs-3 ">
                  <FiMessageCircle
                    onClick={() => {
                      setShowModal(true);
                      setCopyOfChats(OriginalChats);
                    }}
                  />
                </NavItem>
              </>
            ) : (
              []
            )}

            <Offcanvas
              isOpen={offer}
              direction="end"
              fade={false}
              toggle={orders}
            >
              <OffcanvasHeader toggle={orders}>New Order's</OffcanvasHeader>
              <OffcanvasBody>
                {offerNotification.length === 0 ? (
                  <DropdownItem>No new messages</DropdownItem>
                ) : (
                  offerNotification.map((item, index) => (
                    <DropdownItem
                      key={index}
                      onClick={() => HandleOrderSelection(item)}
                      className="fw-bold"
                    >
                      New Offer By : {userOffering.firstName}{" "}
                      {userOffering.lastName}
                    </DropdownItem>
                  ))
                )}
              </OffcanvasBody>
            </Offcanvas>

            <NavItem className="text-white ">
              <Button color="danger" className="p-1 " onClick={Logout}>
                Logout
              </Button>
            </NavItem>
            {user.role === "worker" ? (
              <>
                <NavItem className="text-white ">
                  <OnOffButton user={user} />
                </NavItem>
              </>
            ) : (
              []
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default UserNavbar;
