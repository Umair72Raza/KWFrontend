import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [copyOfChats, setCopyOfChats] = useState();
  const [chat, setChat] = useState();
  const [OriginalChats, setOriginalChats] = useState();
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification,setNotification] = useState([]);
  const [offerNotification,SetONotification]=useState([])
  const [selectedChatCompare,setSelectedChatCompare] =useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [gotOffer, setGotOffer] = useState(false);
  const [userOffering,setUserOffering]=useState();
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
         gotOffer, setGotOffer,
         userOffering,setUserOffering
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
