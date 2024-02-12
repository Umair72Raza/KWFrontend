import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [copyOfChats, setCopyOfChats] = useState([]);
  const [chat, setChat] = useState();
  const [OriginalChats, setOriginalChats] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [offerNotification, SetONotification] = useState([]);
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState({});
  const [gotOffer, setGotOffer] = useState(false);
  const [userOffering, setUserOffering] = useState([]);
  const [chatFromWorkerCard, setChatFromWorkerCard] = useState(null);
  const [notificationTimeouts, setNotificationTimeouts] = useState([]);
  const [availableJobOffer, setAvailableJobOffer] = useState(null);

  return (
    <ChatContext.Provider
      value={{
        showModal,
        setShowModal,
        selectedChat,
        setSelectedChat,
        copyOfChats,
        setCopyOfChats,
        chat,
        setChat,
        OriginalChats,
        setOriginalChats,
        newMessageText,
        setNewMessageText,
        messages,
        setMessages,
        socketConnected,
        setSocketConnected,
        onlineUsers,
        setOnlineUsers,
        notification,
        setNotification,
        offerNotification,
        SetONotification,
        selectedChatCompare,
        setSelectedChatCompare,
        receiveMessage,
        setReceiveMessage,
        gotOffer,
        setGotOffer,
        userOffering,
        setUserOffering,
        setUnreadMessages,
        unreadMessages,
        setChatFromWorkerCard,
        chatFromWorkerCard,
        notificationTimeouts,
        setNotificationTimeouts,
        setAvailableJobOffer,
        availableJobOffer,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
