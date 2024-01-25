import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, Spinner } from "reactstrap";
import {
  SendMessageAsync,
  ToggleChatSeen,
  fetchMessages,
  updateChatsWithWorkers,
} from "../../Redux/Slices/ChatSlice";
import { ChatState } from "../../Context/ChatProvider";
import { FaDotCircle } from "react-icons/fa";
import { SelectChat } from "../../utils";
import { useSelector } from "react-redux";
import Booking from "../booking popup/booking";
import { ChatPopUpPage } from "../../Constants/Constants";
import { set } from "lodash";

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
  } = ChatState();

  const { user, token } = useSelector((state) => state.auth);
  const socket = useSelector((state) => state?.socket?.socket);

  const messagesContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [worker, SetWorker] = useState({});
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [loadingSendMessage, setLoadingSendMessage] = useState(false);

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
    socket?.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.newMessage.chatId
      ) {
        const alreadyInNotifications = notification.some(
          (notification) =>
            notification.newMessage.chatId ===
            newMessageReceived.newMessage.chatId
        );
        if (!alreadyInNotifications) {
          dispatch(
            ToggleChatSeen({
              chatId: newMessageReceived.newMessage.chatId,
              token,
              seen: false,
            })
          ).then((result) => {
            if (result.type === "Chat/ToggleSeen/fulfilled") {
              // Find the index of the chat to be updated
              const index = copyOfChats?.findIndex(
                (c) => c?._id === result.payload._id
              );

              // If the chat is found, create a new array with the updated chat
              if (index !== -1) {
                const updatedChats = [...copyOfChats];
                updatedChats.splice(index, 1, result.payload);
                // dispatch(updateChatsWithWorkers(updatedChats));
                setOriginalChats(updatedChats);
                setCopyOfChats(updatedChats); // Trigger a re-render with the new array
                newMessageReceived.chat.seen = false;
                setNotification([newMessageReceived, ...notification]);
              } else {
                setCopyOfChats([newMessageReceived.chat, ...copyOfChats]);
                setOriginalChats([newMessageReceived.chat, ...OriginalChats]);
                setNotification([newMessageReceived, ...notification]);
              }
            }
          });
        } else {
          setUnreadMessages((prevUnreadMessages) => ({
            ...prevUnreadMessages,
            [newMessageReceived.newMessage.chatId]:
              (prevUnreadMessages[newMessageReceived.newMessage.chatId] || 1) +
              1,
          }));
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

  const book = (selectedChat) => {
    SetWorker(selectedChat);
    toggleModal();
  };
  const toggleModal = () => {
    setModal(!modal);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setSendButtonDisabled(true);
    // Add loading state until the message is sent
    setLoadingSendMessage(true);

    try {
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
            setChat(result.payload.chat);
            setSelectedChatCompare(result.payload.chat);
            setSelectedChat(() => SelectChat(result.payload.chat));
          }
          setMessages([...messages, result.payload.message]);
          const NewMessageAndUserId = {
            newMessage: result.payload.message,
            chat: chat._id ? chat : result.payload.chat,
          };
          socket?.emit("new message", NewMessageAndUserId);
          if (messages) {
            setMessages([...messages, result.payload.message]);
          } else {
            setMessages([result.payload.message]);
          }
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
    setChat(chat);
    setSelectedChatCompare(chat);
    setSelectedChat(() => SelectChat(chat));
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
  };

  const Toggler = () => {
    setShowModal(!showModal);
    document.body.style.overflow = showModal ? "hidden" : "auto";
    const updatedChats = copyOfChats.filter(
      (chat) => chat.chatName !== "fakeChat"
    );
    setCopyOfChats(updatedChats);
    setOriginalChats(updatedChats);
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

    if (isLoading) {
      return (
        <div className=" vh-100 d-flex flex-column justify-content-center align-items-center">
          {" "}
          <Spinner
            style={{ width: "3rem", height: "3rem", marginTop: "25px" }}
          />
        </div>
      );
    }

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
      <div className="no-messages">
        {messages.length === 0 && !isLoading
          ? ChatPopUpPage.START_CONVERSATION
          : null}
      </div>
    );
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
            <ModalBody className="" style={{ overflowY: "auto" }}>
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
                                onChange={(e) => {
                                  setSendButtonDisabled(false);
                                  setNewMessageText(e.target.value);
                                }}
                                disabled={isLoading}
                              />
                              <Button
                                disabled={sendButtonDisabled || isLoading}
                                color={ChatPopUpPage.SEND_BUTTON_COLOR}
                                outline
                              >
                                {loadingSendMessage ? (
                                  <Spinner size="sm" className="p-2" />
                                ) : (
                                  ChatPopUpPage.SEND_BUTTON_LABEL
                                )}
                              </Button>
                            </form>
                          </div>
                        ) : copyOfChats?.length > 0 ? (
                          copyOfChats.map((chat) => (
                            <React.Fragment key={chat._id}>
                              <div
                                className={`d-flex flex-row align-items-center my-2`}
                              >
                                <div className="d-flex flex-column w-100">
                                  {chat.users.map((chatUser) => {
                                    if (
                                      chatUser &&
                                      chatUser._id &&
                                      String(chatUser._id) !== String(user._id)
                                    ) {
                                      const isBlockedByAdmin =
                                        chatUser.access === "denied"
                                          ? true
                                          : false;
                                      return (
                                        <div
                                          key={chatUser._id}
                                          className={`pt-2 d-flex flex-row justify-content-between ${
                                            isBlockedByAdmin
                                              ? "blocked-user"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            !isBlockedByAdmin &&
                                            handleChatSelection(chat)
                                          }
                                        >
                                          <h5>
                                            {chatUser.firstName}{" "}
                                            {chatUser.lastName}
                                          </h5>
                                          {!chat?.seen &&
                                            chat.latestMessage?.sender !==
                                              user._id && (
                                              <span>
                                                <FaDotCircle className="text-primary me-3" />
                                              </span>
                                            )}
                                          {isBlockedByAdmin && (
                                            <span className="text-danger">
                                              {ChatPopUpPage.BLOCKED_BY_ADMIN}
                                            </span>
                                          )}
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
                        ) : (
                          // Render when no chats available
                          <div>{ChatPopUpPage.NO_CHATS}</div>
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
                        {copyOfChats?.length === 0 ? (
                          <div>{ChatPopUpPage.NO_CHATS}</div>
                        ) : (
                          copyOfChats?.map((chat) => (
                            <>
                              <div
                                className={`d-flex flex-row align-items-center my-2`}
                                key={chat._id}
                              >
                                <div className="d-flex flex-column w-100">
                                  {chat.users.map((chatUser) => {
                                    if (
                                      chatUser &&
                                      chatUser._id &&
                                      String(chatUser._id) !== String(user._id)
                                    ) {
                                      const isBlockedByAdmin =
                                        chatUser.access === "denied"
                                          ? true
                                          : false;
                                      return (
                                        <div
                                          key={chatUser._id}
                                          className={`pt-2 d-flex flex-row justify-content-between ${
                                            isBlockedByAdmin
                                              ? "blocked-user"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            !isBlockedByAdmin &&
                                            handleChatSelection(chat)
                                          }
                                        >
                                          <h5>
                                            {chatUser.firstName}{" "}
                                            {chatUser.lastName}
                                          </h5>
                                          {!chat?.seen &&
                                            chat.latestMessage?.sender !==
                                              user._id && (
                                              <span>
                                                <FaDotCircle className="text-primary me-3" />
                                              </span>
                                            )}
                                          {isBlockedByAdmin && (
                                            <span className="text-danger">
                                              {ChatPopUpPage.BLOCKED_BY_ADMIN}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              </div>
                              <hr />
                            </>
                          ))
                        )}
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
                              onChange={(e) => {
                                setSendButtonDisabled(false);
                                setNewMessageText(e.target.value);
                              }}
                              disabled={isLoading}
                            />
                            <Button
                              disabled={sendButtonDisabled || isLoading}
                              color={ChatPopUpPage.SEND_BUTTON_COLOR}
                              outline
                            >
                              {loadingSendMessage ? (
                                <Spinner size="sm" className="p-2" />
                              ) : (
                                ChatPopUpPage.SEND_BUTTON_LABEL
                              )}
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
