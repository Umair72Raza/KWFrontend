import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Slider from "react-slick";
import { SelectChat, truncateText } from "../../utils";
import { FiMessageCircle } from "react-icons/fi";
import { ChatState } from "../../Context/ChatProvider";
import { PopUpState } from "../../Context/PopUpProvider";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const OpenJobs = ({ spinnerVisible, scheduledOrdersObject }) => {
  const {
    setShowModal,
    setNotification,
    setSelectedChat,
    setChat,
    setSelectedChatCompare,
    copyOfChats,
    setUnreadMessages,
    setCopyOfChats,
    unreadMessages,
    setAvailableJobOffer,
  } = ChatState();
  const { setFromAvailableJobs } = PopUpState();
  const { user } = useSelector((state) => state.auth);
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
  const [imageDataURL, setImageDataURL] = useState([]);
  const socket = useSelector((state) => state?.socket?.socket);

  useEffect(() => {
    // Convert image URLs to Blob objects
    const blobArray = scheduledOrdersObject.map((order) => {
      return order.images.map((image) => {
        return new Blob([image], { type: "image/jpeg" });
      });
    });
    setImageDataURL(blobArray);
  }, [scheduledOrdersObject]);

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details?.replace(/<br\s*\/?>/g, "\n");
    return showFullDetailsMap[order.id]
      ? order.details
      : truncateText(transformedDetails, 30);
  };

  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const getCorrectImageUrl = (imageName) => {
    const extensions = ["jpg", "jpeg", "png", "gif"]; // List of possible image extensions
    const baseUrl =
      import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT + "upload/orderImages/"; // Base URL for the images

    // Iterate through each extension and check if the image with that extension exists
    for (const ext of extensions) {
      const imageUrl = `${baseUrl}${imageName}.${ext}`;
      // Check if the image exists by attempting to load it
      const image = new Image();
      image.src = imageUrl;
      if (image.width > 0 && image.height > 0) {
        // If the image loads successfully, return its URL
        return imageUrl;
      }
    }

    // If no valid image URL is found, return a placeholder image or an error image URL
    return "placeholder_image_url.jpg"; // Replace "placeholder_image_url.jpg" with your desired fallback image URL
  };

  const handleMessageIconClick = (order) => {
    // Update available job offer and set 'from available jobs' flag
    setAvailableJobOffer(order);
    setFromAvailableJobs(true);

    // Check if the user is already in chats
    const isUserInChats = copyOfChats?.some((chat) =>
      chat?.users?.some((chatUser) => chatUser?._id === order?.user?._id)
    );

    // Get the current user (worker)
    const worker = user;

    // If the user is not in chats, create a fake chat
    if (!isUserInChats) {
      const fakeChat = {
        _id: "",
        chatName: "fakeChat",
        users: [worker, order?.user],
        latestMessage: null,
        seen: true,
      };

      // Update state with the fake chat
      setCopyOfChats((prevCopyOfChats) => {
        const updatedChats =
          prevCopyOfChats.length > 0
            ? [fakeChat, ...prevCopyOfChats]
            : [fakeChat];
        setChat(fakeChat);
        setSelectedChatCompare(fakeChat);
        setSelectedChat(() => SelectChat(fakeChat));
        return updatedChats;
      });
    } else {
      // Find the chat with the user
      const userChat = copyOfChats.find((chat) =>
        chat?.users?.some((chatUser) => chatUser?._id === order?.user?._id)
      );

      // If the order user's access is 'accepted'
      if (order?.user?.access === "accepted") {
        // Update selected chat, remove notifications, and reset unread messages count
        setChat(userChat);
        setSelectedChatCompare(userChat);
        setSelectedChat(() => SelectChat(userChat));
        setNotification((prevNotifications) =>
          prevNotifications.filter((n) => n?.chat?._id !== userChat?._id)
        );
        if (unreadMessages[userChat?._id]) {
          setUnreadMessages((prevCount) => ({
            ...prevCount,
            [userChat._id]: 0,
          }));
        }
      }
    }

    // Show the modal
    setShowModal(true);
  };

  const openGoogleMaps = (location) => {
    const [longitude, latitude] = location?.coordinates || [];
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, "_blank");
    } else {
      console.error("Invalid coordinates");
    }
  };

  const sendBid = async (order, Uid) => {
    //  emit socket event to show Worker wants to start the job modal.

    if (user.status !== "online") {
      return Swal.fire({
        title: "You are not online",
        icon: "error",
      });
    }
   // setGlobalStartButtonDisabled(true);
    // setStartButtonDisabledMap((prevMap) => ({
    //   ...prevMap,
    //   [order._id]: true,
    // }));

    const data = {
      order,
      Uid,
      workerId: user._id
    };

    // setTimeout(() => {
    //   setGlobalStartButtonDisabled(false);
    //   setStartButtonDisabledMap((prevMap) => ({
    //     ...prevMap,
    //     [order._id]: false,
    //   }));
    // }, 60000); // 1 minute

    socket.emit("startBid-accept-reject", data);
    Swal.fire({
      title: "Accept Job request sent!",
      icon: "success",
    });
  };

  return (
    <Container>
      {spinnerVisible ? (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      ) : (
        <>
          <Row>
            {scheduledOrdersObject?.map((order, index) => (
              <Col
                key={index}
                sm="6"
                md="6"
                lg="4"
                style={{ marginTop: "10px" }}
              >
                <Card className="shadow" style={{ backgroundColor: "#f6f8fc" }}>
                  <CardBody>
                    <h5
                      style={{
                        marginTop: "4%",
                        textAlign: "center",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }}
                    >
                      {order?.Title}
                    </h5>
                    <CardText>
                      <b>Posted by:</b> {order?.user?.firstName}{" "}
                      {order?.user?.lastName}
                    </CardText>
                    <CardText>
                      <b>Time:</b> {order?.time}
                    </CardText>
                    <CardText>
                      <b>Date:</b> {order?.date}
                    </CardText>
                    <CardText>
                      <b>Amount:</b> ${order?.amount}
                    </CardText>
                    <CardText>
                      <b>Address:</b> {order?.user?.address}
                    </CardText>
                    <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                      {order?.service && order.service.length > 0 && (
                        <CardText>
                          <b>Services:</b>
                          <ul
                            style={{
                              listStyleType: "none",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            {order?.service?.map((s, index) => (
                              <li key={index}>{s}</li>
                            ))}
                          </ul>
                        </CardText>
                      )}
                    </div>
                    <CardText>
                      <b>Details:</b>{" "}
                      <div
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >
                        {showFullDetailsMap[order.id] ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: order?.details,
                            }}
                          />
                        ) : (
                          transformOrderDetails(order)
                        )}
                        {order?.details?.length > 30 && (
                          <Button
                            style={{ marginTop: "-5px" }}
                            color="link"
                            onClick={() => toggleDetails(order?.id)}
                          >
                            {showFullDetailsMap[order?.id]
                              ? "Show Less"
                              : "Show More"}
                          </Button>
                        )}
                      </div>
                    </CardText>
                    {order?.images?.length > 0 && (
                      <CardText className="mb-5">
                        <b>Images:</b>
                        {order?.images?.length > 0 && (
                          <Row>
                            <Slider {...settings} className="">
                              {order.images?.map((image, index) => (
                                <div className="text-center" key={index}>
                                  <img
                                    key={index}
                                    src={`${
                                      import.meta.env
                                        .VITE_LOCAL_BACKEND_ENDPOINT
                                    }${image}`}
                                    alt={`Modal Image ${index}`}
                                    className="img-fluid "
                                    style={{
                                      height: "100px",
                                      textAlign: "center",
                                    }}
                                  />
                                </div>
                              ))}
                            </Slider>
                          </Row>
                        )}
                      </CardText>
                    )}
                    <CardText>
                      {" "}
                      <Button
                        onClick={() => openGoogleMaps(order?.user?.location)}
                        color="primary"
                        className=" ms-2 "
                      >
                        Directions <FaMapMarkerAlt />
                      </Button>{" "}
                    </CardText>
                    <CardText className="d-flex justify-content-around align-items-center">
                      <Button
                        onClick={() =>
                          sendBid(order, order?.user?._id)
                        }
                        color="success"
                      >
                        Accept
                      </Button>
                      <Button
                        color="info"
                        className="fw-bold hover-pointer"
                        onClick={() => handleMessageIconClick(order)}
                        style={{
                          color: "white",
                        }}
                      >
                        <FiMessageCircle className="fs-4 " /> Chat{" "}
                      </Button>
                    </CardText>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default OpenJobs;
