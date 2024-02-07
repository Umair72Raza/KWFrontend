import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
  Row,
  Col,
  Container,
  FormGroup,
  Form,
  Input,
} from "reactstrap";
import {
  SendMessageAsync,
  ToggleChatSeen,
  fetchMessages,
} from "../../Redux/Slices/ChatSlice";
import { ChatState } from "../../Context/ChatProvider";
import { SelectChat, hasOnlyWhiteSpace } from "../../utils";
import { useSelector } from "react-redux";
import Booking from "../booking popup/booking";
import { ChatPopUpPage } from "../../Constants/Constants";
import { useTransition, animated } from "@react-spring/web";
import personPNG from "../../assets/images/dummyProfile/user.png";
import { is } from "@react-spring/shared";
import { set } from "lodash";
import MessageImagesCarousel from "../MessageImageCarsousel/MessageImagesCarousel";
import { PopUpState } from "../../Context/PopUpProvider";

const ChatPopup = () => {
  let {
    copyOfChats,
    setCopyOfChats,
    showModal,
    setShowModal,
    selectedChat,
    setSelectedChat,
    chat,
    setChat,
    setOriginalChats,
    OriginalChats,
    setNewMessageText,
    newMessageText,
    messages,
    setMessages,
    setOnlineUsers,
    notification,
    setNotification,
    selectedChatCompare,
    setSelectedChatCompare,
    setUnreadMessages,
    unreadMessages,
    chatFromWorkerCard,
    setChatFromWorkerCard,
  } = ChatState();

  const { fromAvailableJobs, setFromAvailableJobs } = PopUpState();

  const { user, token } = useSelector((state) => state.auth);
  const socket = useSelector((state) => state?.socket?.socket);
  const messagesContainerRefLaptop = useRef(null);
  const messagesContainerRefTabletAndMobile = useRef(null);
  const [scrollPositionForLaptop, setScrollPositionForLaptop] = useState(0);
  const [scrollPositionForMobile, setScrollPositionForMobile] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [profilePicImageLoaded, setProfilePicImageLoaded] = useState(false);

  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [worker, SetWorker] = useState({});
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);
  const [chatAndUserId, setChatAndUserId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [pictureError, setPictureError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);

  const chatTransitions = useTransition(copyOfChats, {
    from: { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
    enter: { opacity: 1, transform: "translate3d(0%, 0, 0)" },
    leave: { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
  });
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedChat && chat) {
        const result = await dispatch(
          fetchMessages({ chatId: chat._id, token })
        );
        if (result.type === "Chat/messages/fulfilled") {
          if (chat && chat.seen === false) {
            dispatch(ToggleChatSeen({ chatId: chat._id, token, seen: true }))
              .then((result) => {
                if (result.type === "Chat/ToggleSeen/fulfilled") {
                  if (notification.length > 0) {
                    setNotification(
                      notification.filter(
                        (n) => n.chat._id !== result.payload._id
                      )
                    );
                  }
                  // Find the index of the chat to be updated
                  const index = copyOfChats.findIndex(
                    (c) => c._id === result.payload._id
                  );

                  // If the chat is found, create a new array with the updated chat
                  if (index !== -1) {
                    const updatedChats = [...copyOfChats];
                    updatedChats.splice(index, 1, result.payload);
                    // dispatch(updateChatsWithWorkers(updatedChats));
                    setOriginalChats(updatedChats);
                    setCopyOfChats(updatedChats); // Trigger a re-render with the new array
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
          setMessages(result.payload.messages || []);
          socket?.emit("join chat", chat._id);
          setLoading(false);
        } else {
          setMessages([]);
          setLoading(false);
        }
      } else {
        setMessages([]);
        setLoading(false);
      }
    };
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (user && user._id) {
      socket?.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    } else {
      return () => {
        socket?.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    let chatIdAndUserId;

    socket?.on("message received", (newMessageReceived) => {
      // Check if the new message belongs to the selected chat
      if (
        !selectedChatCompare ||
        selectedChatCompare?._id !== newMessageReceived?.newMessage?.chatId
      ) {
        chatIdAndUserId = {
          chat: newMessageReceived?.chat,
          userId: user?._id,
        };

        // Save chatAndUserId to state
        setChatAndUserId(chatIdAndUserId);
        // Check if the new message is already in notifications
        const alreadyInNotifications = notification?.some(
          (notification) =>
            notification?.newMessage?.chatId ===
            newMessageReceived?.newMessage?.chatId
        );

        if (!alreadyInNotifications) {
          dispatch(
            ToggleChatSeen({
              chatId: newMessageReceived?.newMessage?.chatId,
              token,
              seen: false,
            })
          ).then((result) => {
            if (result.type === "Chat/ToggleSeen/fulfilled") {
              const index = copyOfChats?.findIndex(
                (c) => c?._id === result?.payload?._id
              );

              if (index !== -1) {
                // If chat is not at the top of the array, move it to the top
                if (index !== 0) {
                  const updatedChats = [
                    result?.payload,
                    ...copyOfChats.slice(0, index),
                    ...copyOfChats.slice(index + 1),
                  ];
                  setOriginalChats(updatedChats);
                  setCopyOfChats(updatedChats);
                }
              } else {
                setCopyOfChats([result.payload, ...copyOfChats]);
                setOriginalChats([result.payload, ...OriginalChats]);
              }
              setNotification([newMessageReceived, ...notification]);
            }
          });
        }
      } else {
        if (messages) {
          setMessages([...messages, newMessageReceived.newMessage]);
        } else {
          setMessages([newMessageReceived.newMessage]);
        }
      }
    });

    return () => {
      socket?.off("message received");
    };
  });

  useEffect(() => {
    if (!socket) return;

    if (chatAndUserId) {
      socket?.emit("updateTheChatNotificationCount", chatAndUserId);
    }

    return () => {
      socket?.off("updateTheChatNotificationCount");
    };
  }, [chatAndUserId]);

  useEffect(() => {
    if (!socket) return;
    socket?.on("updatedCount", (data) => {
      console.log(data, "  data");
      // Use a callback function to update the state based on the previous state
      setUnreadMessages((prevUnreadMessages) => {
        // Check if the chat ID already exists in the unreadMessages state
        if (prevUnreadMessages[data.chatId] !== undefined) {
          // If the chat ID exists, update its unread count
          return {
            ...prevUnreadMessages,
            [data.chatId]: data.unreadCount,
          };
        } else {
          // If the chat ID does not exist, add it to the unreadMessages state
          return {
            ...prevUnreadMessages,
            [data.chatId]: data.unreadCount,
          };
        }
      });
    });

    return () => {
      socket?.off("updatedCount");
    };
  });

  const book = (selectedChat) => {
    SetWorker(selectedChat);
    toggleModal();
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  const handleMessageInputChange = (e) => {
    const inputValue = e.target.value;
    if (hasOnlyWhiteSpace(inputValue)) {
      setSendButtonDisabled(true);
    } else {
      setSendButtonDisabled(false);
    }
    setNewMessageText(inputValue);
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    // Add loading state until the message is sent
    setLoadingSendMessage(true);
    setSendButtonDisabled(true);

    try {
      if (newMessageText || selectedFiles.length > 0) {
        const formData = new FormData();

        // Prepare form data
        formData.append("receiverId", selectedChat._id);
        formData.append("text", newMessageText.trim());
        formData.append("initiatorId", user._id);
        formData.append("token", token);

        // Append images to form data
        selectedFiles.forEach((image, index) => {
          formData.append(`images`, image);
        });

        // Send message
        const result = await dispatch(SendMessageAsync(formData));

        if (result.type === "Chat/SendMessage/fulfilled") {
          const { chat, message: newMessage } = result.payload;

          // Update chat-related states
          setNewMessageText("");
          setSelectedFiles([]);
          document.getElementById("fileInput").value = null;

          if (!chat._id) {
            // Add new chat to the list
            const updatedOriginalChats = [chat, ...OriginalChats];
            setOriginalChats(updatedOriginalChats);
            setCopyOfChats(updatedOriginalChats);
          } else if (
            copyOfChats.length > 1 &&
            copyOfChats[0]._id !== chat._id
          ) {
            // Update chat list if chat already exists
            const updatedChats = [
              chat,
              ...copyOfChats.filter((c) => c._id !== chat._id),
            ];
            setCopyOfChats(updatedChats);
            setOriginalChats(updatedChats);
          }

          // Update messages state
          setMessages((prevMessages) => [...prevMessages, newMessage]);

          // Emit new message event to the socket
          const newMessageAndUserId = { newMessage, chat };
          socket?.emit("new message", newMessageAndUserId);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Reset loading state and enable the send button
      setLoadingSendMessage(false);
      setSendButtonDisabled(false);
    }
  };

  const handleChatSelection = (chat) => {
    const data = {
      userId: user._id,
      chatId: chat._id,
    };

    // Reset selectedFiles if there are any
    if (selectedFiles.length > 0) {
      setSelectedFiles([]);
    }
    //Reset The profile Pic Image Loaded if mobile
    if (screen.width <= 1024) {
      setProfilePicImageLoaded(false);
    }
    // Reset newMessageText
    setNewMessageText("");

    // Reset images loading state
    setImagesLoading(true);

    // Update chat-related states
    setChat(chat);
    setSelectedChatCompare(chat);
    setSelectedChat(() => SelectChat(chat));

    // Remove notifications for the selected chat
    setNotification((prevNotifications) =>
      prevNotifications.filter((n) => n?.chat?._id !== chat?._id)
    );

    // Emit chat read event to the server
    socket?.emit("chat read", data);

    // Reset unread message count if applicable
    if (unreadMessages[chat._id]) {
      setUnreadMessages((prevCount) => ({
        ...prevCount,
        [chat._id]: 0,
      }));
    }
    // Reset file input value if there are selected files
    if (selectedFiles.length > 0) {
      document.getElementById("fileInput").value = null;
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const errorMessage = validateFiles(files);

    if (errorMessage) {
      handleFileError(errorMessage, event.target);
    } else {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
    }
  };

  const validateFiles = (files) => {
    if (files.length > 5) {
      return "Please select up to 5 files only.";
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return "File size exceeds the limit of 5 MB.";
      }
      if (selectedFiles.some((selectedFile) => selectedFile === file)) {
        return "File already selected.";
      }
    }

    return "";
  };
  const handleProfileImageLoadedEnd = () => {
    setProfilePicImageLoaded(true);
  };

  const handleImageLoadEnd = () => {
    setImagesLoading(false); // Set imagesLoading to false once image is loaded
  };

  const handleFileError = (errorMessage, inputElement) => {
    setSendButtonDisabled(true);
    setPictureError(errorMessage);
    setTimeout(() => setPictureError(""), 5000);
    inputElement.value = null;
  };

  const handleRemovePicture = (indexToRemove) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (_, index) => index !== indexToRemove
      );
      // Clear the input value
      document.getElementById("fileInput").value = null;
      return updatedFiles;
    });
  };

  const handleBack = () => {
    const updatedChats = copyOfChats.filter(
      (chat) => chat.chatName !== "fakeChat"
    );
    setCopyOfChats(updatedChats);
    setOriginalChats(updatedChats);
    setSelectedChatCompare(null);
    setSelectedChat(null);
    setChat(null);
    setNewMessageText("");
    setSelectedFiles([]);
    setImagesLoading(false);
    if (screen.width <= 1024) {
      setProfilePicImageLoaded(false);
    }
    // Reset file input value if there are selected files
    if (selectedFiles.length > 0) {
      document.getElementById("fileInput").value = null;
    }
  };

  const Toggler = () => {
    setShowModal((prevShowModal) => !prevShowModal);
    setChatFromWorkerCard(false);
    setImagesLoading(false);
    const updatedChats = copyOfChats.filter(
      (chat) => chat.chatName !== "fakeChat"
    );
    setCopyOfChats(updatedChats);
    setOriginalChats(updatedChats);
    setSelectedChatCompare(null);
    setSelectedChat(null);
    setChat(null);
    setNewMessageText("");
    setSelectedFiles([]);
    setImagesLoading(false);
    if(fromAvailableJobs){
      setFromAvailableJobs(false);
    }
    if (profilePicImageLoaded === true) {
      setProfilePicImageLoaded(false);
    }

    // Reset file input value if there are selected files
    if (selectedFiles.length > 0) {
      document.getElementById("fileInput").value = null;
    }
  };

  const scrollToBottom = () => {
    const scrollToBottomHelper = (messagesContainerRef) => {
      if (messagesContainerRef.current) {
        const messagesContainer = messagesContainerRef.current;
        const lastMessage = messagesContainer.lastElementChild;
        if (lastMessage) {
          lastMessage.scrollIntoView({ block: "end" });
        }
      }
    };

    scrollToBottomHelper(messagesContainerRefTabletAndMobile);
    scrollToBottomHelper(messagesContainerRefLaptop);
  };

  const enterCarousel = (images) => {
    setImages(images);
    setIsOpen(true);
    if (messagesContainerRefTabletAndMobile.current) {
      setScrollPositionForMobile(
        messagesContainerRefTabletAndMobile.current.scrollTop
      );
    }
    if (messagesContainerRefLaptop.current) {
      setScrollPositionForLaptop(messagesContainerRefLaptop.current.scrollTop);
    }
  };

  const exitCarousel = () => {
    setImages([]);
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isOpen) {
      if (messagesContainerRefTabletAndMobile.current) {
        messagesContainerRefTabletAndMobile.current.scrollTop =
          scrollPositionForMobile;
      }
      if (messagesContainerRefLaptop.current) {
        messagesContainerRefLaptop.current.scrollTop = scrollPositionForLaptop;
      }
    }
  }, [isOpen, scrollPositionForLaptop, scrollPositionForMobile]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages, selectedChat]);

  const formatTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    return messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const renderMessages = () => {
    if (isLoading) {
      return (
        <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
          <Spinner
            style={{ width: "3rem", height: "3rem", marginTop: "25px" }}
          />
        </div>
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return (
        <div className="no-messages">
          {!isLoading && ChatPopUpPage.START_CONVERSATION}
        </div>
      );
    }

    let lastMessageDate = null;

    return messages.map((message) => {
      const messageDate = new Date(message.createdAt);
      let separator = null;

      if (!lastMessageDate || !isSameDay(lastMessageDate, messageDate)) {
        separator = (
          <div
            className="message-separator text-center my-4 rounded-5 align-self-center"
            key={`separator-${message._id}`}
          >
            {isSameDay(new Date(), messageDate)
              ? ChatPopUpPage.MESSAGE_TODAY
              : isSameDay(
                  new Date(new Date().setDate(new Date().getDate() - 1)),
                  messageDate
                )
              ? ChatPopUpPage.MESSAGE_YESTERDAY
              : messageDate.toLocaleDateString()}
          </div>
        );
      }

      lastMessageDate = messageDate;

      return (
        <React.Fragment key={message._id}>
          {separator}
          <div
            className={`ps-3 d-flex flex-column ${
              message.sender._id === user._id
                ? "sent-message justify-content-end mt-4 me-4 p-5"
                : "received-message mt-4 ms-3"
            }`}
            style={{
              wordWrap: "break-word",
              maxWidth: "100%",
            }}
            onClick={() => enterCarousel(message.images)}
          >
            {imagesLoading && message?.images?.length > 0 && (
              <Spinner size="sm" color="primary" />
            )}
            {message?.images?.length === 1 ? (
              <img
                src={`${import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT}${
                  message.images[0]
                }`}
                alt={`Image 0`}
                className={`message-image hover-pointer ${
                  imagesLoading ? "d-none" : "d-block"
                }`}
                onLoadStart={() => setImagesLoading(true)}
                onLoad={handleImageLoadEnd}
                onError={handleImageLoadEnd}
              />
            ) : (
              <div
                className={
                  message?.images?.length > 2
                    ? "image-grid hover-pointer"
                    : "message-images"
                }
              >
                {message?.images?.slice(0, 2)?.map((image, index) => (
                  <img
                    key={index}
                    src={`${
                      import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT
                    }${image}`}
                    alt={`Image ${index}`}
                    className={`message-image ${
                      imagesLoading ? "d-none" : "d-block"
                    }`}
                    onLoadStart={() => setImagesLoading(true)}
                    onLoad={handleImageLoadEnd}
                    onError={handleImageLoadEnd}
                  />
                ))}
                {message?.images?.length > 2 && (
                  <div className="more-images">
                    +{message?.images?.length - 2} more
                  </div>
                )}
              </div>
            )}
            <div>{message?.content}</div>
          </div>
          <div
            className={
              message.sender._id === user._id ? "align-self-end me-4" : "ms-3"
            }
            style={{ wordWrap: "break-word", maxWidth: "100%" }}
          >
            {formatTime(message.createdAt)}
          </div>
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <>
        {showModal && copyOfChats && (
          <Modal isOpen={showModal} toggle={() => Toggler()} size="xl" centered>
            <ModalHeader
              toggle={() => Toggler()}
              className="d-flex flex-row justify-content-between align-items-center hover-pointer"
            >
              <h5 className="ms-3 fw-bold">{ChatPopUpPage.CHAT_TITLE}</h5>
            </ModalHeader>
            <ModalBody className="overflow-y-auto" style={{ height: "500px" }}>
              <Container className=" d-xl-none d-block">
                <Row>
                  <Col className="col-12">
                    <Row className=" p-0">
                      {isOpen ? (
                        <MessageImagesCarousel
                          images={images}
                          isOpen={isOpen}
                          exitCarousel={exitCarousel}
                        />
                      ) : (
                        <>
                          {selectedChat ? (
                            <Col className="selected-chat">
                              <Col className="chat-header d-flex flex-row align-items-center">
                                {!chatFromWorkerCard&& !fromAvailableJobs && (
                                  <Col>
                                    <FiArrowLeft
                                      className="fs-4 me-3 hover-pointer"
                                      onClick={handleBack}
                                    />
                                  </Col>
                                )}
                                <Row className=" w-100">
                                  <Col className="d-flex flex-row">
                                    {!profilePicImageLoaded && (
                                      <Spinner
                                        size="sm"
                                        animation="border"
                                        color="primary"
                                      />
                                    )}
                                    <img
                                      src={
                                        selectedChat?.profilePicture
                                          ? `${
                                              import.meta.env
                                                .VITE_LOCAL_BACKEND_ENDPOINT
                                            }${selectedChat?.profilePicture}`
                                          : personPNG
                                      }
                                      alt="Profile"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                      }}
                                      onLoad={handleProfileImageLoadedEnd}
                                      onError={handleProfileImageLoadedEnd}
                                    />

                                    <h5 className="ms-3 mt-2">
                                      {selectedChat.firstName}{" "}
                                      {selectedChat.lastName}
                                    </h5>
                                  </Col>{" "}
                                  {user.role === "user" &&
                                  !fromAvailableJobs ? (
                                    <Col className="d-flex justify-content-end">
                                      {" "}
                                      <Button
                                        style={{
                                          height: "45px",
                                          width: "60px",
                                        }}
                                        className="align-self-center"
                                        color={ChatPopUpPage.BOOK_BUTTON_COLOR}
                                        onClick={() => book(selectedChat)}
                                      >
                                        {ChatPopUpPage.BOOK_BUTTON_LABEL}
                                      </Button>
                                    </Col>
                                  ) : null}
                                  {fromAvailableJobs && user?.role === "worker" && (
                                    <Button
                                      style={{
                                        height: "45px",
                                        width: "105px",
                                      }}
                                      color="primary"
                                      className="align-self-center"
                                    >
                                      View Offer
                                    </Button>
                                  )}
                                </Row>
                              </Col>
                              <div
                                className=" max-height-message messages d-flex flex-column h-100 "
                                ref={messagesContainerRefTabletAndMobile}
                              >
                                {" "}
                                {renderMessages()}
                              </div>

                              <Form
                                onSubmit={sendMessage}
                                className="message-input d-flex flex-column "
                              >
                                <FormGroup className="d-flex flex-row w-100">
                                  <div className="position-relative w-100">
                                    {" "}
                                    {/* Wrap input and icon */}
                                    <Input
                                      type="text"
                                      placeholder="Type a message..."
                                      value={newMessageText}
                                      onChange={handleMessageInputChange}
                                      disabled={loadingSendMessage || isLoading}
                                    />
                                    <Input
                                      id="fileInput"
                                      type="file"
                                      accept="image/*"
                                      onChange={handleFileChange}
                                      style={{ display: "none" }}
                                      multiple={selectedFiles.length <= 5}
                                    />
                                    <FaCamera
                                      className="fs-4 position-absolute end-0 top-50 translate-middle-y me-2 hover-pointer"
                                      onClick={() =>
                                        document
                                          .getElementById("fileInput")
                                          .click()
                                      }
                                    />{" "}
                                    {/* Use position-absolute and position classes to position the icon */}
                                  </div>
                                  <Button
                                    className="ms-2"
                                    disabled={
                                      sendButtonDisabled ||
                                      loadingSendMessage ||
                                      isLoading
                                    }
                                    color={ChatPopUpPage.SEND_BUTTON_COLOR}
                                    outline
                                  >
                                    {loadingSendMessage ? (
                                      <Spinner size="sm" className="p-2" />
                                    ) : (
                                      ChatPopUpPage.SEND_BUTTON_LABEL
                                    )}
                                  </Button>
                                </FormGroup>
                                {!loadingSendMessage &&
                                  selectedFiles &&
                                  selectedFiles.length > 0 && (
                                    <div className="z-3 position-absolute imagesDiv ">
                                      {/* Display previously selected pictures */}
                                      {selectedFiles.map((file, index) => (
                                        <div
                                          key={index}
                                          className="position-relative d-flex align-items-start "
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt="file"
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                            }}
                                          />
                                          {/* Close button for each picture */}
                                          <div
                                            className="closeButtonForPictureInchat hover-pointer"
                                            onClick={() =>
                                              handleRemovePicture(index)
                                            }
                                          >
                                            <IoClose />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                {pictureError && (
                                  <span
                                    className={`position-absolute pictureError bg-danger px-2 py-1 text-white rounded ${
                                      pictureError ? "active" : ""
                                    }`}
                                  >
                                    {pictureError}
                                  </span>
                                )}
                              </Form>
                            </Col>
                          ) : copyOfChats?.length > 0 ? (
                            chatTransitions(
                              (style, item) =>
                                item && (
                                  <animated.div
                                    style={{ ...style, marginBottom: "0px" }}
                                  >
                                    <React.Fragment key={item._id} >
                                      <Row
                                        className={`d-flex flex-row align-items-center my-2`}
                                      >
                                        <Col className="d-flex flex-column w-100">
                                          {item.users.map((chatUser) => {
                                            if (
                                              chatUser &&
                                              chatUser?._id &&
                                              String(chatUser?._id) !==
                                                String(user?._id)
                                            ) {
                                              const isBlockedByAdmin =
                                                chatUser?.access === "denied"
                                                  ? true
                                                  : false;
                                              return (
                                                <Row
                                                  key={chatUser?._id}
                                                  className={`pt-2 d-flex flex-row justify-content-between ${
                                                    isBlockedByAdmin
                                                      ? "blocked-user"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    !isBlockedByAdmin &&
                                                    handleChatSelection(item)
                                                  }
                                                >
                                                  <Col className="d-flex flex-row">
                                                    {!profilePicImageLoaded && (
                                                      <Spinner
                                                        size="sm"
                                                        animation="border"
                                                        color="primary"
                                                      />
                                                    )}
                                                    <img
                                                      src={
                                                        chatUser?.profilePicture
                                                          ? `${
                                                              import.meta.env
                                                                .VITE_LOCAL_BACKEND_ENDPOINT
                                                            }${
                                                              chatUser?.profilePicture
                                                            }`
                                                          : personPNG
                                                      }
                                                      alt="Profile"
                                                      style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "50%",
                                                      }}
                                                      onLoad={
                                                        handleProfileImageLoadedEnd
                                                      }
                                                      onError={
                                                        handleProfileImageLoadedEnd
                                                      }
                                                    />
                                                    <h5 className="align-self-center ms-3">
                                                      {chatUser.firstName}{" "}
                                                      {chatUser.lastName}
                                                    </h5>
                                                  </Col>
                                                  {unreadMessages[item._id] >
                                                    0 &&
                                                    item.latestMessage
                                                      ?.sender !== user._id && (
                                                      <Col className="d-flex justify-content-end align-items-center">
                                                        <span className="notification-circle">
                                                          {
                                                            unreadMessages[
                                                              item._id
                                                            ]
                                                          }
                                                        </span>
                                                      </Col>
                                                    )}
                                                  {isBlockedByAdmin && (
                                                    <span className="text-danger">
                                                      {
                                                        ChatPopUpPage.BLOCKED_BY_ADMIN
                                                      }
                                                    </span>
                                                  )}
                                                </Row>
                                              );
                                            }
                                            return null;
                                          })}
                                        </Col>
                                      </Row>
                                      <hr />
                                    </React.Fragment>
                                  </animated.div>
                                )
                            )
                          ) : (
                            // Render when no chats available
                            <div>{ChatPopUpPage.NO_CHATS}</div>
                          )}
                        </>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Container>

              {/* // For tablet and laptop, display chat and messages side by side */}
              <Container className=" d-none d-xl-block">
                <Row>
                  {!chatFromWorkerCard && (
                    <Col className=" chat-list overflow-y-auto">
                      {copyOfChats?.length === 0 ? (
                        <div>{ChatPopUpPage.NO_CHATS}</div>
                      ) : (
                        chatTransitions(
                          (style, item) =>
                            item && (
                              <animated.div
                                style={{ ...style, height: "auto" }}
                              >
                                <React.Fragment key={item._id}>
                                  <Row
                                    className={`d-flex flex-row align-items-center my-2`}
                                  >
                                    <Col className="d-flex flex-column w-100">
                                      {item.users.map((chatUser) => {
                                        if (
                                          chatUser &&
                                          chatUser?._id &&
                                          String(chatUser?._id) !==
                                            String(user?._id)
                                        ) {
                                          const isBlockedByAdmin =
                                            chatUser?.access === "denied"
                                              ? true
                                              : false;
                                          return (
                                            <Row
                                              key={chatUser?._id}
                                              className={`pt-2 d-flex flex-row justify-content-between ${
                                                isBlockedByAdmin
                                                  ? "blocked-user"
                                                  : ""
                                              }`}
                                              onClick={() =>
                                                !isBlockedByAdmin &&
                                                handleChatSelection(item)
                                              }
                                            >
                                              <Col className="d-flex flex-row">
                                                {!profilePicImageLoaded && (
                                                  <Spinner
                                                    size="sm"
                                                    animation="border"
                                                    color="primary"
                                                  />
                                                )}
                                                <img
                                                  src={
                                                    chatUser?.profilePicture
                                                      ? `${
                                                          import.meta.env
                                                            .VITE_LOCAL_BACKEND_ENDPOINT
                                                        }${
                                                          chatUser?.profilePicture
                                                        }`
                                                      : personPNG
                                                  }
                                                  alt="Profile"
                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    borderRadius: "50%",
                                                  }}
                                                  onLoad={
                                                    handleProfileImageLoadedEnd
                                                  }
                                                  onError={
                                                    handleProfileImageLoadedEnd
                                                  }
                                                />
                                                <h5 className="align-self-center ms-3">
                                                  {chatUser.firstName}{" "}
                                                  {chatUser.lastName}
                                                </h5>
                                              </Col>
                                              {unreadMessages[item._id] > 0 &&
                                                item.latestMessage?.sender !==
                                                  user._id && (
                                                  <Col className="d-flex justify-content-end align-items-center ">
                                                    <div className=" notification-circle">
                                                      {unreadMessages[item._id]}
                                                    </div>
                                                  </Col>
                                                )}
                                              {isBlockedByAdmin && (
                                                <span className="text-danger">
                                                  {
                                                    ChatPopUpPage.BLOCKED_BY_ADMIN
                                                  }
                                                </span>
                                              )}
                                            </Row>
                                          );
                                        }
                                        return null;
                                      })}
                                    </Col>
                                  </Row>
                                  <hr />
                                </React.Fragment>
                              </animated.div>
                            )
                        )
                      )}
                    </Col>
                  )}

                  <Row className={`${chatFromWorkerCard ? "col-12" : "col-9"}`}>
                    {isOpen ? (
                      <MessageImagesCarousel
                        images={images}
                        isOpen={isOpen}
                        exitCarousel={exitCarousel}
                      />
                    ) : (
                      <>
                        {" "}
                        {selectedChat ? (
                          <Col className="selected-chat">
                            <Col className="chat-header d-flex flex-row align-items-center">
                              {!chatFromWorkerCard && !fromAvailableJobs && (
                                <Col>
                                  <FiArrowLeft
                                    className="fs-4 me-3 hover-pointer"
                                    onClick={handleBack}
                                  />
                                </Col>
                              )}
                              <Row className="w-100">
                                <Col className="d-flex flex-row">
                                  {!profilePicImageLoaded && (
                                    <Spinner
                                      size="sm"
                                      animation="border"
                                      color="primary"
                                    />
                                  )}
                                  <img
                                    src={
                                      selectedChat?.profilePicture
                                        ? `${
                                            import.meta.env
                                              .VITE_LOCAL_BACKEND_ENDPOINT
                                          }${selectedChat?.profilePicture}`
                                        : personPNG
                                    }
                                    alt="Profile"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                    }}
                                    onLoad={handleProfileImageLoadedEnd}
                                    onError={handleProfileImageLoadedEnd}
                                  />
                                  <h5 className="ms-3 mt-2">
                                    {selectedChat.firstName}{" "}
                                    {selectedChat.lastName}
                                  </h5>
                                </Col>{" "}
                                {user.role === "user" ? (
                                  <Col className="d-flex justify-content-end">
                                    {" "}
                                    <Button
                                      style={{ height: "45px", width: "60px" }}
                                      className="align-self-center"
                                      color={ChatPopUpPage.BOOK_BUTTON_COLOR}
                                      onClick={() => book(selectedChat)}
                                    >
                                      {ChatPopUpPage.BOOK_BUTTON_LABEL}
                                    </Button>
                                  </Col>
                                ) : null}
                                {fromAvailableJobs && user?.role === "worker" && (
                                    <Button
                                      style={{
                                        height: "45px",
                                        width: "105px",
                                      }}
                                      color="primary"
                                      className="align-self-center"
                                    >
                                      View Offer
                                    </Button>
                                  )}
                              </Row>
                            </Col>

                            <div
                              className="messages d-flex flex-column h-100 max-height-message "
                              ref={messagesContainerRefLaptop}
                            >
                              {" "}
                              {renderMessages()}
                            </div>

                            <Form
                              onSubmit={sendMessage}
                              className="message-input d-flex flex-column "
                            >
                              <FormGroup className="d-flex flex-row w-100">
                                <div className="position-relative w-100">
                                  {" "}
                                  {/* Wrap input and icon */}
                                  <Input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessageText}
                                    onChange={handleMessageInputChange}
                                    disabled={loadingSendMessage || isLoading}
                                  />
                                  <Input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                    multiple={selectedFiles.length < 5}
                                  />
                                  <FaCamera
                                    className="fs-4 position-absolute end-0 top-50 translate-middle-y me-2 hover-pointer"
                                    onClick={() =>
                                      document
                                        .getElementById("fileInput")
                                        .click()
                                    }
                                  />{" "}
                                  {/* Use position-absolute and position classes to position the icon */}
                                </div>
                                <Button
                                  className="ms-2"
                                  disabled={
                                    sendButtonDisabled ||
                                    loadingSendMessage ||
                                    isLoading
                                  }
                                  color={ChatPopUpPage.SEND_BUTTON_COLOR}
                                  outline
                                >
                                  {loadingSendMessage ? (
                                    <Spinner size="sm" className="p-2" />
                                  ) : (
                                    ChatPopUpPage.SEND_BUTTON_LABEL
                                  )}
                                </Button>
                              </FormGroup>
                              {!loadingSendMessage &&
                                selectedFiles &&
                                selectedFiles.length > 0 && (
                                  <div className="z-3 position-absolute imagesDiv">
                                    {/* Display previously selected pictures */}
                                    {selectedFiles.map((file, index) => (
                                      <div
                                        key={index}
                                        className="position-relative d-flex align-items-start"
                                      >
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt="file"
                                          style={{
                                            width: "100px",
                                            height: "100px",
                                          }}
                                        />
                                        {/* Close button for each picture */}
                                        <div
                                          className="closeButtonForPictureInchat hover-pointer"
                                          onClick={() =>
                                            handleRemovePicture(index)
                                          }
                                        >
                                          <IoClose />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              {pictureError && (
                                <span
                                  className={` position-absolute pictureError bg-danger text-white px-2 py-1 rounded ${
                                    pictureError ? "active" : ""
                                  }`}
                                >
                                  {pictureError}
                                </span>
                              )}
                            </Form>
                          </Col>
                        ) : (
                          <Col className=" ">
                            {/* Empty div when no chat is selected */}
                            {ChatPopUpPage.SELECT_CHAT_LABEL}
                          </Col>
                        )}
                      </>
                    )}
                  </Row>
                </Row>
              </Container>
            </ModalBody>

            <Booking
              modal={modal}
              toggle={toggleModal}
              worker={worker}
              chat={chat}
            />
          </Modal>
        )}
      </>
    </div>
  );
};

export default ChatPopup;
