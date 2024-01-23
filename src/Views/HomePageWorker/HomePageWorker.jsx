// / eslint-disable no-unused-vars /;
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
  Button,
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
import ChatPopup from "../../Components/Chat Box/ChatPop";
import { ChatState } from "../../Context/ChatProvider";
import { Spinner } from "reactstrap";
import Swal from "sweetalert2";
import "./styles.css";
import PastOrdersCard from "../../Components/OrderComponents/PastOrdersCard";
import {
  hideSpinner,
  selectSpinnerVisibility,
  showSpinner,
} from "../../Redux/Slices/LoaderSlice";
import { HomePageWorkerConsts, TABS } from "../../Constants/Constants";
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
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
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
  } = ChatState();

  const [startJobStatus, setStartJobStatus] = useState("");

  useEffect(() => {
    if (!socket) return;
    socket?.on("gotNewOffer", (data) => {
      if (!chat || !data.chat || chat._id !== data.chat._id) {
        const alreadyPresent = offerNotification.some((obj) => {
          return obj.params.users[0] === data.params.users[0];
        });
        if (!alreadyPresent) {
          SetONotification([data, ...offerNotification]);
          //setUserOffering(data.user);
          //setUserOffering([data.user,...userOffering]);
        }
      } else {
        setGotOffer(true);
        setReceiveMessage(data.params);
        setUserOffering(data.user);
      }
    });
    return () => {
      socket?.off("gotNewOffer");
    };
  });

  useEffect(() => {
    socket?.on("startjob-result", (data) => {
      //console.log(data);
      if (data.result === "true") {
        setStartJobStatus("true");
        setStartJobVerified(true);
        setOid(data?.order?.Title);

        // Use the functional form of setScheduledOrders to access the previous state
        setScheduledOrders((prevScheduledOrders) => {
          // Check if the order exists in scheduledOrders
          const scheduledOrderIndex = prevScheduledOrders.findIndex(
            (order) => order.id === data.order.id
          );

          if (scheduledOrderIndex !== -1) {
            // Remove from scheduledOrders
            const updatedScheduledOrders = [...prevScheduledOrders];
            updatedScheduledOrders.splice(scheduledOrderIndex, 1);

            // Set the updated scheduled orders to the local state
            setScheduledOrders(updatedScheduledOrders);

            setActiveOrder((prevActiveOrders) => {
              // Check if the order is already present in active orders
              const isOrderAlreadyPresent = prevActiveOrders.some(
                (order) => order._id === data.order._id
              );

              if (!isOrderAlreadyPresent) {
                // Add the order to active orders if it's not present
                return [...prevActiveOrders, data.order];
              }

              // If the order is already present, return the current state
              return prevActiveOrders;
            });

            return updatedScheduledOrders;
          }

          return prevScheduledOrders;
        });
      } else if (data.result == "false") {
        setStartJobStatus("false");
        setStartJobVerified(true);
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
      if (!reason || !reason.length) {
        reason = HomePageWorkerConsts.REASON_NOT_MENTIONED;
      }
      const formattedDetails = Corder?.details || "";
      const truncatedDetails =
        formattedDetails.length > 5
          ? formattedDetails.slice(0, 5) + "..."
          : formattedDetails;

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
              <strong class="custom-align-left">Reason:</strong>
              <div class="custom-height custom-align-left swal-text-content text-wrap">${reason}</div>
            </div>
          `,
          icon: "error",
          customClass: {
            content: 'swal-content-custom' // You can add a custom class for the content
          }
        });

        setScheduledOrders((prevScheduledOrders) => {
          // Check if the order exists in scheduledOrders
          const scheduledOrderIndex = prevScheduledOrders.findIndex(
            (order) => order.id === Corder.id
          );

          if (scheduledOrderIndex !== -1) {
            // Remove from scheduledOrders
            const updatedScheduledOrders = [...prevScheduledOrders];
            updatedScheduledOrders.splice(scheduledOrderIndex, 1);

            // Set the updated scheduled orders to the local state
            setScheduledOrders(updatedScheduledOrders);

            setCancelledOrders((prevCancelledOrders) => {
              // Check if the order is already present in active orders
              const isOrderAlreadyPresent = prevCancelledOrders.some(
                (order) => order._id === Corder._id
              );

              if (!isOrderAlreadyPresent) {
                // Add the order to active orders if it's not present
                return [...prevCancelledOrders, Corder];
              }

              // If the order is already present, return the current state
              return prevCancelledOrders;
            });

            return updatedScheduledOrders;
          }

          return prevScheduledOrders;
        });
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

    socket?.emit("accept-reject", {
      result: "accept",
      Uid: receiveMessage.users[0],
    });
    document.body.style.overflow = "auto";
  };

  //reject the offer
  const handleCancel = () => {
    setGotOffer(false);
    socket?.emit("accept-reject", {
      result: "cancel",
      Uid: receiveMessage.users[0],
    });
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    dispatch(fetchChatsAsync({ user, token }));
  }, []);

  useEffect(() => {
    if (chats) {
      setOriginalChats(chats);
      setCopyOfChats(chats);
    }
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
    activeOrder.length,
    activeTab,
    cancelledOrders.length,
    dispatch,
    pastOrders.length,
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
        if (pastOrders.length === 0) {
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
        if (cancelledOrders.length === 0) {
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
      console.log(newOrderResult, "new order result");
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
                    {isScheduledOrdersFetched && scheduledOrders ? (
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
                      />
                    ) : (
                      <>{TABS.NO_SCH_ORDERS}</>
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
                {pastOrders ? (
                  <PastOrdersCard scheduledOrdersObject={pastOrders} />
                ) : (
                  <h1>{TABS.NO_PAST_ORDERS}</h1>
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <h2 style={{ textAlign: "center" }}>{TABS.CANCELLED_ORDERS}</h2>
              <Col>
                {cancelledOrders ? (
                  <>
                    <CancelledOrders scheduledOrdersObject={cancelledOrders} />
                  </>
                ) : (
                  <h1>{TABS.NO_CANC_ORDERS}</h1>
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <h2 style={{ textAlign: "center" }}>{TABS.ACTIVE_ORDERS}</h2>
              <Col>
                {activeOrder ? (
                  <>
                    <ActiveOrders
                      scheduledOrdersObject={activeOrder}
                      setPastOrders={setPastOrders}
                      updateActiveOrders={setActiveOrder}
                    />
                  </>
                ) : (
                  <span>{TABS.NO_ACTIVE_ORDERS}</span>
                )}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Row>
      {gotOffer ? (
        <>
          <GotOffer
            formattedOfferDetails={receiveMessage}
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
      <ChatPopup />
      <div style={{textAlign:"center"}}>
      {spinnerVisible && <Spinner />}
      </div>
      
    </Container>
  );
};

export default HomePageWorker;
