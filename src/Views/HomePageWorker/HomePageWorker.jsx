import React, { useEffect, useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Container,
} from "reactstrap";
import "./styles.css";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveOrdersAsync,
  fetchCancelledOrdersAsync,
  fetchPastOrdersAsync,
  fetchScheduledOrdersAsync,
} from "../../Redux/Slices/OrderSlice";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import CancelledOrders from "../../Components/OrderComponents/CancelledOrders";
import ScheduledOrdersCardWorker from "../../Components/OrderComponents/SchOrdersWorker";
import ActiveOrders from "../../Components/OrderComponents/ActiveOrders";
import GotOffer from "../../Components/GotOffer/GotOffer";
import StartJob from "../../Components/StartJob/StartJob";
import { fetchChatsAsync } from "../../Redux/Slices/ChatSlice";
import { ChatState } from "../../Context/ChatProvider";
import Swal from "sweetalert2";
import PastOrdersCard from "../../Components/OrderComponents/PastOrdersCard";
import {
  hideSpinner,
  selectSpinnerVisibility,
  showSpinner,
} from "../../Redux/Slices/LoaderSlice";
import { HomePageWorkerConsts, TABS } from "../../Constants/Constants";
import { PopUpState } from "../../Context/PopUpProvider";
import { failureToast } from "../../utils";
const HomePageWorker = () => {
  const [toggleCancel, setToggleCancel] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [pastClicked, setPastClicked] = useState(false);
  const [cancelledClicked, setCancelledClicked] = useState(false);
  const [isScheduledOrdersFetched, setIsScheduledOrdersFetched] =
    useState(false);
  const [isPastOrdersFetched, setIsPastOrdersFetched] = useState(false);
  const [isCacelledOrdersFetched, setIsCancelledOrdersFetched] =
    useState(false);
  const [isActiveOrdersFetched, setIsActiveOrdersFetched] = useState(false);
  const [startJobVerified, setStartJobVerified] = useState(false); //make it true if the user sends back finalize order start
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [updateScheduled, setUpdateScheduled] = useState(false);
  const [latestOrder, setLatestOrders] = useState();
  const spinnerVisible = useSelector(selectSpinnerVisibility);
  const { socket } = useSelector((state) => state?.socket);
  const chats = useSelector((state) => state?.chat?.ChatsWithWorkers);
  const [oId, setOid] = useState();
  let {
    setOriginalChats,
    setCopyOfChats,
    offerNotification,
    SetONotification,
    chat,
    receiveMessage,
    setReceiveMessage,
    gotOffer,
    setGotOffer,
    setUserOffering,
    setUnreadMessages,
    unreadMessages,notificationTimeouts, setNotificationTimeouts
  } = ChatState();

  let {
    cancelledOrders,
    setCancelledOrders,
    scheduledOrders,
    setScheduledOrders,
    activeOrder,
    setActiveOrder,
    pastOrders,
    setPastOrders,
    startButtonDisabledMap,
    setStartButtonDisabledMap,
    globalStartButtonDisabled,
    setGlobalStartButtonDisabled,
  } = PopUpState();

  const [startJobStatus, setStartJobStatus] = useState("");

  
  const offerTimeUp = (data) => {
    setGotOffer(false);
    SetONotification((prevNotifications) =>
      prevNotifications.filter((n) => n !== data)
    );
    socket?.emit("accept-reject", {
      result: "timeup",
      Uid: data.users[0],
    });
    failureToast("Offer time expired!");

    const index = notificationTimeouts.findIndex(
      (timeoutData) => timeoutData.notification === data
    );

    if (index !== -1) {
      clearTimeout(notificationTimeouts[index].timeoutId);
      setNotificationTimeouts((prevTimeouts) =>
        prevTimeouts.filter((_, i) => i !== index)
      );
    }
  };

  const addNotificationTimeout = (notification, timeoutId) => {
    setNotificationTimeouts((prevTimeouts) => [
      ...prevTimeouts,
      { notification, timeoutId },
    ]);
  };
  useEffect(() => {
    if (!socket) return;
    socket?.on("gotNewOffer", (data) => {
      

      if (!chat || !data.chat || chat._id !== data.chat._id) {
        const alreadyPresent = offerNotification.some((obj) => {
          return obj.params.users[0] === data.params.users[0];
        });
        if (!alreadyPresent) {
          SetONotification([data, ...offerNotification]);
          addNotificationTimeout(
            data,
            setTimeout(() => offerTimeUp(data.params), 1 * 60 * 1000)
          );
        }
      } else {
        setGotOffer(true);
        setReceiveMessage(data);
        setUserOffering(data.user);
      }
    });

    return () => {
      socket?.off("gotNewOffer");
    };
  });

  useEffect(() => {
    socket?.on("startjob-result", (data) => {
      if (data.result === "true") {
        setStartJobStatus("true");
        setStartJobVerified(true);
        console.log(scheduledOrders, "all scheduled orders");
        console.log(data.order, "order in start job data");
        setOid(data?.order?.Title);
        setScheduledOrders((prevScheduledOrders) =>
          prevScheduledOrders.filter(
            (scheduledOrder) => scheduledOrder._id !== data.order._id
          )
        );

        setActiveOrder((prevActiveOrders) => [...prevActiveOrders, data.order]);
      } else if (data.result == "false") {
        setStartJobStatus("false");
        setStartJobVerified(true);
        setGlobalStartButtonDisabled(false);
        setStartButtonDisabledMap((prevMap) => ({
          ...prevMap,
          [data.order._id]: false,
        }));
      }
    });
    return () => {
      socket?.off("startjob-result");
    };
  });

  useEffect(() => {
    socket?.on("order-cancelled", (data) => {
      const Corder = data.order;
      let reason = data.reason;
      // Check if reason is empty and set a default message
      if (!reason || !reason?.length) {
        reason = HomePageWorkerConsts.REASON_NOT_MENTIONED;
      }
      if (Corder) {
        Swal.fire({
          title: "Order Cancelled",
          html: `
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Order Title:</strong> ${Corder.Title}
            </div>
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Order Details:</strong> ${Corder.details}
            </div>
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Service:</strong> ${Corder.service}
            </div>
            <div class="custom-align-left swal-text-content">
              <strong class="custom-align-left">Amount:</strong> ${Corder.amount}
            </div>
           
            <div class="custom-align-left swal-text-content">
            <strong class="custom-align-left">Reasons:</strong> ${reason}
          </div>
          `,
          icon: "error",
          customClass: {
            content: "swal-content-custom", // You can add a custom class for the content
          },
          didOpen: () => {
            document.body.style.overflow = "hidden"; // Disable scroll when SweetAlert is open
          },
          willClose: () => {
            document.body.style.overflow = ""; // Re-enable scroll when SweetAlert is closing
          },
          allowOutsideClick: false,
        });

        setScheduledOrders((prevScheduledOrders) =>
          prevScheduledOrders.filter(
            (scheduledOrder) => scheduledOrder._id !== Corder._id
          )
        );

        setCancelledOrders((prevCancelledOrders) => [
          ...prevCancelledOrders,
          Corder,
        ]);
      }
    });
    return () => {
      socket?.off("order-cancelled");
    };
  });

  //accept the offer
  const handleConfirm = async () => {
    setGotOffer(false);
    // send true to the event to socket
    const index = notificationTimeouts.findIndex(
      (timeoutData) => timeoutData.notification == receiveMessage
    );

    if (index !== -1) {
      clearTimeout(notificationTimeouts[index].timeoutId);
      setNotificationTimeouts((prevTimeouts) =>
        prevTimeouts.filter((_, i) => i !== index)
      );
      console.log(index,"offer expire deleted")
    }
    socket?.emit("accept-reject", {
      result: "accept",
      Uid: receiveMessage.params.users[0],
    });
    document.body.style.overflow = "auto";
  };

  //reject the offer
  const handleCancel = () => {
    setGotOffer(false);
    socket?.emit("accept-reject", {
      result: "cancel",
      Uid: receiveMessage.params.users[0],
    });
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    if (user && token) {
      dispatch(fetchChatsAsync({ user, token }));
    }
  }, []);

  useEffect(() => {
    if (chats && chats.length > 0) {
      // Emitting notifications to the server for all chats
      socket?.emit("notifications", { user, chats });

      // Handling incoming chat notifications from the server
      socket?.on("chat-notifications", (chatNotifications) => {
        // console.log(chatNotifications);
        const newUnreadMessages = {};

        // Update the unread message count state for each chat
        chatNotifications.forEach(({ chatId, unreadCount }) => {
          newUnreadMessages[chatId] = unreadCount;
        });

        // Update the state with all chat IDs and their unread message counts
        setUnreadMessages(newUnreadMessages);
      });

      // Set the original and copy of chats
      setOriginalChats(chats);
      setCopyOfChats(chats);
    }

    return () => {
      socket?.off("chat-notification");
      socket?.off("notifications");
    };
  }, [chats]);

  useEffect(() => {
    const fetchData = async () => {
      let result;
      switch (activeTab) {
        case "1":
          // Check if scheduledOrders is already available locally
          if (!isScheduledOrdersFetched) {
            dispatch(showSpinner());
            result = await dispatch(fetchScheduledOrdersAsync(token));
            if (result.type === "orders/fetchScheduledOrders/fulfilled") {
              setScheduledOrders(result.payload.orders);
              setIsScheduledOrdersFetched(true);
              dispatch(hideSpinner());
            }
          }
          if (!isActiveOrdersFetched) {
            dispatch(showSpinner());
            let respo = await dispatch(fetchActiveOrdersAsync(token));
            if (respo.type === "orders/fetchActiveOrders/fulfilled") {
              setActiveOrder(respo.payload.orders);
              setIsActiveOrdersFetched(true);
              dispatch(hideSpinner());
            }
          }
          break;
        case "2":
          // Check if pastOrders is already available locally
          if (!isPastOrdersFetched) {
            dispatch(showSpinner());
            result = await dispatch(fetchPastOrdersAsync(token));
            if (result.type === "orders/fetchPastOrders/fulfilled") {
              setPastOrders(result.payload.orders);
              setIsPastOrdersFetched(true);
              dispatch(hideSpinner());
            }
          }

          break;
        case "3":
          // Check if cancelledOrders is already available locally
          if (!isCacelledOrdersFetched) {
            dispatch(showSpinner());
            result = await dispatch(fetchCancelledOrdersAsync(token));
            if (result.type === "orders/fetchCancelledOrders/fulfilled") {
              setCancelledOrders(result.payload.orders);
              setIsCancelledOrdersFetched(true);
              dispatch(hideSpinner());
            }
          }
          break;
        case "4":
          break;
        default:
          break;
      }
    };

    fetchData();
  }, [
    activeOrder?.length,
    activeTab,
    cancelledOrders?.length,
    dispatch,
    pastOrders?.length,
    scheduledOrders,
  ]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const scheduleClick = () => {
    toggleTab("1");
  };

  const pastClick = async () => {
    toggleTab("2");
    if (pastClicked === false) {
      setPastClicked(true);
      let result = await dispatch(fetchPastOrdersAsync(token));
      if (result.type === "orders/fetchPastOrders/fulfilled") {
        if (pastOrders?.length === 0) {
          setPastOrders(result.payload.orders);
        } else {
          const uniqueOrders = result.payload.orders.filter(
            (newOrder) =>
              !pastOrders.some(
                (existingOrder) => existingOrder._id === newOrder._id
              )
          );

          // Append the unique orders to pastOrders
          setPastOrders((prevPastOrders) => [
            ...prevPastOrders,
            ...uniqueOrders,
          ]);
        }
      }
    }
  };

  const cancelOrders = async () => {
    toggleTab("3");
    if (cancelledClicked === false) {
      setCancelledClicked(true);
      let result = await dispatch(fetchCancelledOrdersAsync(token));
      if (result.type === "orders/fetchCancelledOrders/fulfilled") {
        if (cancelledOrders?.length === 0) {
          setCancelledOrders(result.payload.orders);
        } else {
          const uniqueOrders = result.payload.orders.filter(
            (newOrder) =>
              !cancelledOrders.some(
                (existingOrder) => existingOrder._id === newOrder._id
              )
          );

          // Append the unique orders to pastOrders
          setCancelledOrders((prevCancelledOrders) => [
            ...prevCancelledOrders,
            ...uniqueOrders,
          ]);
        }
      }
    }
  };

  const activeOrders = () => {
    toggleTab("4");
  };

  useEffect(() => {
    socket?.on("new-order-result", (newOrderResult) => {
      setLatestOrders(newOrderResult);
      setUpdateScheduled(true);
    });
    return () => {
      socket?.off("new-order-result");
    };
  });
  return (
    <Container>
      <Row>
        <UserNavbar />
      </Row>
      <Row>
        <Nav tabs style={{ cursor: "pointer" }}>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={scheduleClick}
            >
              {TABS.SCHEDULED}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={pastClick}
            >
              {TABS.PAST}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={cancelOrders}
            >
              {TABS.CANCELLED}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "4" })}
              onClick={activeOrders}
              setPastOrders={setPastOrders}
            >
              {TABS.ACTIVE}
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
      <Row>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col>
                <h2 style={{ textAlign: "center" }}>{TABS.SCH_ORDERS}</h2>
                <Row>
                  <div style={{ marginTop: "10px !important" }}>
                    {isScheduledOrdersFetched && scheduledOrders && (
                      <ScheduledOrdersCardWorker
                        scheduledOrdersObject={scheduledOrders}
                        toggleCancel={toggleCancel}
                        setToggleCancel={setToggleCancel}
                        setScheduledOrders={setScheduledOrders}
                        cancelledOrders={cancelledOrders}
                        setCancelledOrders={setCancelledOrders}
                        latestOrder={latestOrder}
                        setUpdateScheduled={setUpdateScheduled}
                        updateScheduled={updateScheduled}
                        activeOrder={activeOrder}
                        spinnerVisible={spinnerVisible}
                      />
                    )}
                  </div>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <h2 style={{ textAlign: "center" }}>{TABS.PAST_ORDERS}</h2>
              <Col>
                {pastOrders && (
                  <PastOrdersCard
                    scheduledOrdersObject={pastOrders}
                    spinnerVisible={spinnerVisible}
                  />
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <h2 style={{ textAlign: "center" }}>{TABS.CANCELLED_ORDERS}</h2>
              <Col>
                {cancelledOrders && (
                  <>
                    <CancelledOrders
                      scheduledOrdersObject={cancelledOrders}
                      spinnerVisible={spinnerVisible}
                    />
                  </>
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <h2 style={{ textAlign: "center" }}>{TABS.ACTIVE_ORDERS}</h2>
              <Col>
                {activeOrder && (
                  <>
                    <ActiveOrders
                      scheduledOrdersObject={activeOrder}
                      setPastOrders={setPastOrders}
                      updateActiveOrders={setActiveOrder}
                      spinnerVisible={spinnerVisible}
                    />
                  </>
                )}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Row>
      {gotOffer ? (
        <>
          <GotOffer
            formattedOfferDetails={receiveMessage.params}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </>
      ) : (
        <></>
      )}
      {startJobVerified ? (
        <>
          <StartJob
            confirmed={startJobStatus}
            orderId={oId}
            setStartJobVerified={setStartJobVerified}
          />
        </>
      ) : (
        <></>
      )}
      {/* <ChatPopup /> */}
    </Container>
  );
};

export default HomePageWorker;
