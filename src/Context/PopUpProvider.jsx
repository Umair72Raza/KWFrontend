import { createContext, useContext, useState } from "react";
const PopupContext = createContext();

const PopUpContext = ({ children }) => {
  const [finishOrderReq, setFinishOrderReq] = useState(false);
  const [fOrder, setFOrder] = useState("");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [modalHeader, setModalHeader] = useState("");
  const [isFinalize, setIsFinalize] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finishConfirmed, setFinishConfirmed] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const [inputLabel, setInputLabel] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [finalizeFunction, setFinalizeFunction] = useState(false);
  const [clear, setClear] = useState(false);
  const [cancelButtonLabel, setCancelButtonLabel] = useState("");
  const [finalizeButtonLabel, setFinalizeButtonLabel] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [cancelStart, setCancelStart] = useState(false);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [param, SetParam] = useState({});
  const [params, SetParams] = useState({});
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const [startButtonDisabledMap, setStartButtonDisabledMap] = useState({});
  const [globalStartButtonDisabled, setGlobalStartButtonDisabled] =
    useState(false);

  const [isOn, setIsOn] = useState(false);
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
        finishConfirmed,
        setFinishConfirmed,
        clear,
        setClear,
        isOn,
        setIsOn,
        param,
        SetParam,
        startButtonDisabledMap,
        setStartButtonDisabledMap,
        globalStartButtonDisabled,
        setGlobalStartButtonDisabled,pendingOrders, setPendingOrders
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
