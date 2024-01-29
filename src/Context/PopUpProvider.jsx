import { createContext, useContext, useState } from "react";
const PopupContext = createContext();

const PopUpContext = ({ children }) => {
  const [finishOrderReq, setFinishOrderReq] = useState(false);
  const [fOrder, setFOrder] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const [isFinalize, setIsFinalize] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [inputLabel, setInputLabel] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [finalizeFunction, setFinalizeFunction] = useState(false);
  //const [FinalizeFunction,setFinalizefunction] = useState(false);
  const [cancelButtonLabel, setCancelButtonLabel] = useState("");
  const [finalizeButtonLabel, setFinalizeButtonLabel] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [cancelStart, setCancelStart] = useState(false);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [params, SetParams] = useState({});
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const cancel = () => {
    setOrderToCancel(null);
    setModalHeader("");
    setInputLabel("");
    setShowInput(false);
    setFinalizeButtonLabel("");
    setCancelButtonLabel("");
    setFinalizeFunction(false);
    toggleModal();
  };
  const [order, setOrder] = useState("");
  return (
    <PopupContext.Provider
      value={{
        fOrder,
        setFOrder,
        finishOrderReq,
        setFinishOrderReq,
        modalHeader,
        setModalHeader,
        isFinalize,
        setIsFinalize,
        isModalOpen,
        setIsModalOpen,
        inputLabel,
        setInputLabel,
        modalInputValue,
        setModalInputValue,
        cancelButtonLabel,
        setCancelButtonLabel,
        finalizeButtonLabel,
        setFinalizeButtonLabel,
        showInput,
        setShowInput,
        order,
        setOrder,
        toggleModal,
        cancel,
        orderToCancel,
        setOrderToCancel,
        finalizeFunction,
        setFinalizeFunction,
        cancelStart,
        setCancelStart,
        params,
        SetParams,
        cancelledOrders,
        setCancelledOrders,
        scheduledOrders,
        setScheduledOrders,
        activeOrder,
        setActiveOrder,
        pastOrders,
        setPastOrders,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const PopUpState = () => {
  return useContext(PopupContext);
};

export default PopUpContext;
