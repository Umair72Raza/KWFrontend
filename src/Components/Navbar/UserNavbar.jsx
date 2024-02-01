import React, { useEffect, useState } from "react";
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
import { navbarConstants } from "../../Constants/Constants";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync, toggleStatusAsync } from "../../Redux/Slices/AuthSlice";
import { ChatState } from "../../Context/ChatProvider";
import { IoIosNotifications } from "react-icons/io";
import { CgProfile  } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
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
    setSelectedChatCompare,
    unreadMessages,
    setUnreadMessages,
  } = ChatState();
  const socket = useSelector((state) => state?.socket?.socket);

  const [isOpen, setIsOpen] = useState(false);
  const [offer, SetShowOffer] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (unreadMessages) {
      const hasUnreadMessages = Object.values(unreadMessages).some(
        (value) => value > 0
      );
      setNewMessage(hasUnreadMessages);
    }
  }, [unreadMessages]);


  const Logout = async () => {
    Swal.fire({
      title: "Are You Sure You Want To Log Out?",
      showCancelButton: true,
      confirmButtonText: "Log Out",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const id = user._id;
        const data = { id, status: "offline", token };
        const Result = await dispatch(toggleStatusAsync(data));
        await socket?.emit("online-offline", Result.payload.updatedStatus);
        const result = await dispatch(logoutAsync());
        await socket?.disconnect();
        if (result.type === "auth/logout/fulfilled") {
          navigate("/auth/login");
        }
      }
    });
  };

  const orders = () => {
    SetShowOffer(!offer);
  };

  const HandleNotificationSelection = (item) => {
    setChat(item.chat);
    setSelectedChatCompare(item.chat);

    const data = {
      userId: user?._id,
      chatId: item?.chat?._id,
    };
    socket?.emit("chat read", data);

    setUnreadMessages((prevCount) => ({
      ...prevCount,
      [item?.chat?._id]: 0,
    }));

    setSelectedChat(() => SelectChat(item?.chat));

    setNotification((prevNotifications) =>
      prevNotifications.filter((n) => n !== item)
    );

    setShowModal(true);
  };


  const HandleOrderSelection = (notify) => {
    SetONotification(offerNotification.filter((n) => n !== notify));
    setGotOffer(true);
    setReceiveMessage(notify.params);
    SetShowOffer(!offer);
  };

  const HandleEditProfile = () => {
    if (user.role === "user") {
      navigate("/user/editprofile");
    } else if (user.role === "worker") {
      navigate("/worker/editprofile");
    }
  };

  const HandleEditSettings = () =>{
    if(user.role==="admin"){
      navigate("/admin/settings");
    }
  }



  const toggleOffcanvas = () => {
    SetShowOffer(!offer);
  };

  const handleMessageIconClick = () => {
    setCopyOfChats((prevChats) => {
      // Avoid unnecessary state updates if `OriginalChats` is the same as the current `copyOfChats`
      if (prevChats === OriginalChats) {
        return prevChats;
      }

      // Update `copyOfChats` to match `OriginalChats`
      return OriginalChats.slice();
    });

    setShowModal(true);
  };

  return (
    <>
      <Navbar className="bg-primary w-full" expand="sm" dark container="fluid">
        <NavbarBrand href="/" className="fs-bold">
          {navbarConstants.NavBar.brandName}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className=" gap-3 justify-content-end">
          <Nav
            className=" d-flex flex-row gap-4 justify-content-end mt-1 mb-md-1 align-items-center"
            navbar
          >
            {user.role !== "admin" ? (
              <>
                <NavItem
                  className="fs-3 text-white hover-pointer "
                  title="Edit Profile"
                  style={{ marginTop: "2%" }}
                >
                  {user.role === "worker" ? (
                    <>
                      <OnOffButton user={user} />
                    </>
                  ) : (
                    []
                  )}
                </NavItem>
                <UncontrolledDropdown
                  className=" fs-3"
                  nav
                  inNavbar
                  title="View Notifications"
                >
                  <DropdownToggle nav className="d-flex">
                    <div>
                      <IoIosNotifications className=" text-white hover-pointer " />
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
                      <DropdownItem>No new notification.</DropdownItem>
                    ) : (
                      notification.map((item) => (
                        <DropdownItem
                          key={item.chat._id}
                          onClick={() => HandleNotificationSelection(item)}
                          className="fw-bold d-flex flex-row  gap-1 justify-content-between"
                        >
                          New Message: {item.newMessage.sender.firstName}{" "}
                          {item.newMessage.sender.lastName}
                          {unreadMessages[item.chat._id] > 1 && (
                            <div className=" rounded-4 bg-danger text-white px-2">
                              {" "}
                              {unreadMessages[item.chat._id]}
                            </div>
                          )}
                        </DropdownItem>
                      ))
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>

                {user.role == "worker" ? (
                  <NavItem
                    className="text-white fs-3  d-flex hover-pointer "
                    title="View New Offers"
                  >
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
                <NavItem
                  className="text-white fs-3 hover-pointer "
                  title="Chats"
                >
                  {newMessage && (
                    <div className=" position-relative  z-3 notification-Dot"></div>
                  )}

                  <FiMessageCircle
                    className={`${newMessage ? "mb-2" : ""}`}
                    onClick={handleMessageIconClick}
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
                  <div>No new Orders</div>
                ) : (
                  offerNotification.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        HandleOrderSelection(item);
                        toggleOffcanvas(); // Use the correct toggle function for Offcanvas
                      }}
                      className="fw-bold"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "none",
                      }}
                    >
                      New Offer By : {item.user.firstName} {item.user.lastName}
                    </Button>
                  ))
                )}
              </OffcanvasBody>
            </Offcanvas>

            <span className="fs-5" style={{ marginTop: "2%", color: "white" }}>
              {" "}
              {user.firstName} {user.lastName}
            </span>
            <UncontrolledDropdown>
              <DropdownToggle
                style={{
                  border: "2px solid #007BFF",
                  background: "transparent",
                }}
                caret
              ></DropdownToggle>
              <DropdownMenu className="p-2">
                {user.role === "admin" ? (
                  <>
                  <DropdownItem
                      className="d-flex gap-2"
                      onClick={HandleEditSettings}
                    >
                      {" "}
                      <CiSettings className="fs-4" />{" "}
                      <b className="align-self-center">Settings</b>
                    </DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownItem
                      className="d-flex gap-2"
                      onClick={HandleEditProfile}
                    >
                      {" "}
                      <CgProfile className="fs-4" />{" "}
                      <b className="align-self-center">Edit Profile</b>
                    </DropdownItem>
                  </>
                )}

                <DropdownItem className="d-flex flex-row"></DropdownItem>
                <DropdownItem
                  className="d-flex gap-2 justify-content-center"
                  onClick={Logout}
                >
                  {" "}
                  <Button color="danger" className=" ">
                    Logout
                  </Button>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            {/* <NavItem className="text-white "></NavItem> */}
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
};

export default UserNavbar;
