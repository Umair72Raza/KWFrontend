import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { SendMessageAsync, fetchMessages } from "../../Redux/Slices/ChatSlice";
import { ChatState } from "../../Context/ChatProvider";
import socket from "../../SocketManager/socketManager";
import { SelectChat } from "../../utils";
import { useSelector } from "react-redux";
import Booking from "../booking popup/booking";
import { ChatPopUpPage } from "../../Constants/Constants";

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
  } = ChatState();

  const { user, token } = useSelector((state) => state.auth);

 
  const messagesContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [worker, SetWorker] = useState({});

  useEffect(() => {
    const getMessages = async () => {
      if (selectedChat && chat) {
        const result = await dispatch(
          fetchMessages({ chatId: chat._id, token })
        );
        if (result.type === "Chat/messages/fulfilled") {
          setMessages(result.payload || []);
          socket.emit("join chat", chat._id);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };
    getMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (user && user._id) {
      socket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    } else {
      return () => {
        socket.disconnect();
      };
    }
  }, []);


  useEffect(() => {
    if (!socket) return;
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.newMessage.chatId
      ) {
        if (!notification.includes(newMessageReceived.newMessage)) {
          setNotification([newMessageReceived, ...notification]);
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
      socket.off("message received");
    };
  });

  const book = (selectedChat) => {
    SetWorker(selectedChat);
    toggleModal();
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const sendingMessage = async () => {
      if (newMessageText) {
        const messageData = {
          receiverId: selectedChat._id,
          text: newMessageText,
          initiatorId: user._id,
          token,
        };
        const result = await dispatch(SendMessageAsync(messageData));
        if (result.type === "Chat/SendMessage/fulfilled") {
          setNewMessageText("");
          if (!chat._id) {
            setOriginalChats((prev) => [result.payload.chat, ...prev]);
            let dummyChats = [result.payload.chat, ...OriginalChats];
            setCopyOfChats(dummyChats);
            SelectChat(result.payload.chat);
          }
          setMessages([...messages, result.payload.message]);
          const NewMessageAndUserId = {
            newMessage: result.payload.message,
            chat: chat,
          };
          socket.emit("new message", NewMessageAndUserId);
          if (messages) {
            setMessages([...messages, result.payload.message]);
          } else {
            setMessages([result.payload.message]);
          }
        }
      }
    };

    sendingMessage();
  };

  const handleChatSlection = (chat) => {
    setChat(chat);
    setSelectedChatCompare(chat);
    setSelectedChat(() => SelectChat(chat));
  };

  const handleBack = () => {
    setSelectedChatCompare(null);
    setSelectedChat(null);
    setChat(null);
    setNewMessageText("");
  };

  const Toggler = () => {
    setShowModal(!showModal);
    document.body.style.overflow = showModal ? "hidden" : "auto";
    setSelectedChatCompare(null);
    setSelectedChat(null);
    setChat(null);
    setNewMessageText("");
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages]);

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
    let lastMessageDate = null;

    return Array.isArray(messages) && messages.length > 0 ? (
      messages.map((message) => {
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
              className={`ps-3 ${
                message.sender._id === user._id
                  ? "sent-message justify-content-end w-50 mt-4 me-4"
                  : "received-message mt-4 w-50"
              }`}
              style={{
                wordWrap: "break-word",
                maxWidth: "100%",
              }}
            >
              {message.content}
            </div>
            <div
              className={
                message.sender._id === user._id ? "align-self-end me-4" : ""
              }
              style={{
                wordWrap: "break-word",
                maxWidth: "100%",
              }}
            >
              {formatTime(message.createdAt)}
            </div>
          </React.Fragment>
        );
      })
    ) : (
      <div className="no-messages">{ChatPopUpPage.START_CONVERSATION}</div>
    );
  };

  return (
    <div>
      <>
        {showModal && copyOfChats && (
          <Modal
            isOpen={showModal}
            toggle={() => Toggler()}
            size="lg"
            centered
          >
            <ModalHeader
              toggle={() => Toggler()}
              className="d-flex flex-row justify-content-between align-items-center hover-pointer"
            >
              <h5 className="ms-3 fw-bold">{ChatPopUpPage.CHAT_TITLE}</h5>
            </ModalHeader>
            <ModalBody className="Modal-Height" style={{ overflowY: "auto" }}>
              {window.innerWidth <= 768 ? (
                // For mobile devices, display only chats initially
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12">
                      <div className="chat-preview overflow-y-auto max-height-chat-users">
                        {selectedChat ? (
                          // Display messages if a chat is selected
                          <div className="selected-chat">
                            <div className="chat-header d-flex flex-row align-items-center">
                              <div>
                                <FiArrowLeft
                                  className="fs-4 me-3 hover-pointer"
                                  onClick={handleBack}
                                />
                              </div>
                              <div className="d-flex flex-row justify-content-between w-100">
                                <div>
                                  <h5 className="ms-1 mt-2">
                                    {selectedChat.firstName}{" "}
                                    {selectedChat.lastName}
                                  </h5>
                                </div>{" "}
                                {user.role === "user" ? (
                                  <div>
                                    {" "}
                                    <Button
                                      color={ChatPopUpPage.BOOK_BUTTON_COLOR}
                                      onClick={() => book(selectedChat)}
                                    >
                                      {ChatPopUpPage.BOOK_BUTTON_LABEL}
                                    </Button>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div
                              className="messages d-flex flex-column overflow-y-auto max-height-message"
                              ref={messagesContainerRef}
                            >
                              {renderMessages()}
                            </div>
                            <form
                              onSubmit={sendMessage}
                              className="message-input"
                            >
                              <input
                                type="text"
                                placeholder="Type a message..."
                                value={newMessageText}
                                onChange={(e) =>
                                  setNewMessageText(e.target.value)
                                }
                              />
                              <Button color={ChatPopUpPage.SEND_BUTTON_COLOR} outline>
                                {ChatPopUpPage.SEND_BUTTON_LABEL}
                              </Button>
                            </form>
                          </div>
                        ) : (
                          // Show chat list if no chat is selected
                          copyOfChats?.map((chat) => (
                            <React.Fragment key={chat._id}>
                              <div
                                className={`d-flex flex-row align-items-center my-2`}
                                onClick={() => handleChatSlection(chat)}
                              >
                                <div className="d-flex flex-column w-75">
                                  {chat.users.map((chatUser) => {
                                    if (
                                      chatUser &&
                                      chatUser._id &&
                                      String(chatUser._id) !== String(user._id)
                                    ) {
                                      return (
                                        <div
                                          key={chatUser._id}
                                          className="mt-2"
                                        >
                                          <h5>
                                            {chatUser.firstName}{" "}
                                            {chatUser.lastName}
                                          </h5>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                              <hr />
                            </React.Fragment>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // For tablet and laptop, display chat and messages side by side
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-3 chat-list">
                      <div className="chat-preview overflow-y-auto max-height-chat-users">
                        {copyOfChats?.map((chat) => (
                          <>
                            <div
                              className={`d-flex flex-row align-items-center my-2`}
                              key={chat._id}
                              onClick={() => handleChatSlection(chat)}
                            >
                              <div className="d-flex flex-column w-75">
                                {chat.users.map((chatUser) => {
                                  if (
                                    chatUser &&
                                    chatUser._id &&
                                    String(chatUser._id) !== String(user._id)
                                  ) {
                                    return (
                                      <div key={chatUser._id} className="mt-2">
                                        <h5>
                                          {chatUser.firstName}{" "}
                                          {chatUser.lastName}
                                        </h5>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                            <hr />
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="col-9 chat-display">
                      {selectedChat ? (
                        <div className="selected-chat">
                          <div className="chat-header d-flex flex-row align-items-center">
                            <div>
                              {" "}
                              <FiArrowLeft
                                className="fs-4 me-3 hover-pointer"
                                onClick={handleBack}
                              />
                            </div>
                            <div className="d-flex flex-row justify-content-between w-100">
                              <div>
                                <h5 className="ms-1 mt-2">
                                  {selectedChat.firstName}{" "}
                                  {selectedChat.lastName}
                                </h5>
                              </div>{" "}
                              {user.role === "user" ? (
                                <div>
                                  {" "}
                                  <Button
                                    color={ChatPopUpPage.BOOK_BUTTON_COLOR}
                                    onClick={() => book(selectedChat)}
                                  >
                                    {ChatPopUpPage.BOOK_BUTTON_LABEL}
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className="messages d-flex flex-column overflow-y-auto max-height-message"
                            ref={messagesContainerRef}
                          >
                            {renderMessages()}
                          </div>
                          <form
                            onSubmit={sendMessage}
                            className="message-input"
                          >
                            <input
                              type="text"
                              placeholder="Type a message..."
                              value={newMessageText}
                              onChange={(e) =>
                                setNewMessageText(e.target.value)
                              }
                            />
                            <Button color={ChatPopUpPage.SEND_BUTTON_COLOR} outline>
                              {ChatPopUpPage.SEND_BUTTON_LABEL}
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <div className="no-chat-selected">
                          {/* Empty div when no chat is selected */}
                          {ChatPopUpPage.SELECT_CHAT_LABEL}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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



