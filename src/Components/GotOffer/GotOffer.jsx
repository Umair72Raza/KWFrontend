import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
} from "reactstrap";
import Slider from "react-slick";
import { ChatState } from "../../Context/ChatProvider";
import { GOTOFFER } from "../../Constants/Constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SelectChat } from "../../utils";
import { useSelector } from "react-redux";

const GotOffer = ({ formattedOfferDetails,User, onConfirm, onCancel }) => {
  const [showModal, setshowModal] = useState(true);
  const [fullDetailsModal, setFullDetailsModal] = useState(false);
  const [imageDataURL, setImageDataURL] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const [showMore, setShowMore] = useState(false);
  const {
    copyOfChats,
    setCopyOfChats,
    setShowModal,
    chat,
    setSelectedChat,
    setSelectedChatCompare,
    setChat,
    chatFromWorkerCard,
    setChatFromWorkerCard,setNotification,setNewMessageText,setSelectedFiles,setUnreadMessages,unreadMessages
  } = ChatState();
  const socket = useSelector((state) => state?.socket?.socket);
  const formattedDetails = formattedOfferDetails?.details || "";
  const truncatedDetails =
    formattedDetails?.length > 30
      ? formattedDetails.slice(0, 30) + "..."
      : formattedDetails;

  const displayDetails = showMore
    ? formattedOfferDetails?.details
    : truncatedDetails?.slice(0, 30) + "...";
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  let { setGotOffer } = ChatState();

  useEffect(() => {
    const openModal = () => {
      setshowModal(true);
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      setshowModal(false);
      document.body.style.overflow = "";
    };

    openModal();
    // Clean up function
    return () => {
      closeModal();
    };
  }, []);

  const closeModal = () => {
    setshowModal(false);
    document.body.style.overflow = "auto";
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setGotOffer(false);
    closeModal();
  };

  useEffect(() => {
    // When the component mounts, convert the image file to a data URL
    const blobArray = formattedOfferDetails?.images?.map((image, index) => {
      const blob = new Blob([image], { type: "image/jpeg" });
      return blob;
    });
    setImageDataURL(blobArray);
  }, [formattedOfferDetails.images]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setGotOffer(false);
    closeModal();
  };

  // const CustomPrevArrow = (props) => {
  //   const { onClick } = props;
  //   return (
  //     <Button
  //       className="  custom-prev-arrow "
  //       onClick={onClick}
  //     >
  //     prev
  //     </Button>
  //   );
  // };

  // const CustomNextArrow = (props) => {
  //   const { onClick } = props;
  //   return (
  //     <div><Button
  //       className=" custom-next-arrow  "
  //       onClick={onClick}
  //     >
  //     next
  //     </Button></div>
  //   );
  // };
  const settings = {
    mobileFirst: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    //  prevArrow: <CustomPrevArrow />,
    //  nextArrow: <CustomNextArrow />,
  };

  const HandleChat = () => {
    setShowModal(true);
    setChatFromWorkerCard(true);
  
    const isWorkerInChats = copyOfChats?.some(
      (chat) => chat?.users?.some((chatUser) =>  formattedOfferDetails?.users[0] === chatUser?._id )
    );
    console.log(
      copyOfChats,"isWorkerInChats"
    )
    if (!isWorkerInChats) {
      // Create a fake chat
      const fakeChat = {
        _id: "",
        chatName: "fakeChat",
        users: [User, user],
        latestMessage: null,
        seen: true,
      };
  
      setCopyOfChats((prevCopyOfChats) => {
        const updatedChats = prevCopyOfChats.length > 0
          ? [fakeChat, ...prevCopyOfChats]
          : [fakeChat];
        
        setChat(fakeChat);
        setSelectedChatCompare(fakeChat);
        setSelectedChat(() => SelectChat(fakeChat));
  
        return updatedChats;
      });
    } else {
      const workerChat = copyOfChats.find(
        (chat) => chat?.users?.some((chatUser) => chatUser?._id === formattedOfferDetails?.users[0])
      );
  
      const data = {
        userId: user._id,
        chatId: workerChat._id,
      };
    //   setNewMessageText("");
    // setSelectedFiles([]);
        setChat(workerChat);
        setSelectedChatCompare(workerChat);
        setSelectedChat(() => SelectChat(workerChat));
        setNotification((prevNotifications) =>
        prevNotifications.filter((n) => n?.chat?._id !== workerChat?._id)
      );
      socket?.emit("chat read", data);
        if (unreadMessages[workerChat._id]) {
          setUnreadMessages((prevCount) => ({
            ...prevCount,
            [workerChat._id]: 0,
          }));
        }
     
    }
  };

  return (
    <div>
      <Modal isOpen={showModal} keyboard={false} centered>
        <ModalHeader>{GOTOFFER.OFFER_HEADER}</ModalHeader>
        <ModalBody>
          <p>
            <strong>{GOTOFFER.OFFER_TITLE}</strong>{" "}
            {formattedOfferDetails?.Title}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_DATE}</strong> {formattedOfferDetails?.date}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_TIME}</strong> {formattedOfferDetails?.time}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_AMOUNT}</strong>$
            {formattedOfferDetails?.amount}
          </p>
          <p>
            <strong>{GOTOFFER.OFFER_SERVICE}</strong>{" "}
            {formattedOfferDetails?.service}
          </p>
          <p style={{ maxHeight: "100px", overflowY: "scroll" }}>
            <strong>{GOTOFFER.OFFER_DETAILS}</strong>
            <div
              style={{
                whiteSpace: "pre-wrap",
                maxHeight: showMore ? "none" : "100px",
                overflow: "hidden",
              }}
            >
              {displayDetails.replace(/<br\s*\/?>/gi, "\n")}
            </div>
            {truncatedDetails.length > 30 && (
              <Button
                color="link"
                onClick={toggleShowMore}
                style={{ cursor: "pointer", marginTop: "5px" }}
              >
                {showMore ? "Show Less" : "Show More"}
              </Button>
            )}
          </p>

          <p>
            <strong>Task Pictures</strong>
          </p>
          <Row className="">
            <Col>
              {imageDataURL?.length > 2 ? (
                <Slider {...settings} className=" m-5">
                  {imageDataURL?.map((image, index) => (
                    <div className="" key={index}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Modal Image ${index}`}
                        className="img-fluid thumbnail"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <>
                  <div className="d-flex">
                    {imageDataURL?.map((image, index) => (
                      <div className="border" key={index}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Modal Image ${index}`}
                          className="img-fluid thumbnail"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm}>
            {GOTOFFER.ACCEPT_BUTTON}
          </Button>{" "}
          <Button color="danger" onClick={handleCancel}>
            {GOTOFFER.REJECT_BUTTON}
          </Button>{" "}
          <Button color="success" onClick={HandleChat}>
            Chat
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GotOffer;
