/* eslint-disable no-unused-vars */
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
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveOrdersAsync,
  fetchCancelledOrdersAsync,
  fetchPastOrdersAsync,
  fetchScheduledOrdersAsync,
} from "../../Redux/Slices/OrderSlice";
import CancelledOrders from "../../Components/OrderComponents/CancelledOrders";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import ActiveOrders from "../../Components/OrderComponents/ActiveOrders";
import { setnewOrderValue } from "../../Redux/Slices/BookingSlice";
import OrderCard from "../../Components/OrderComponents/OrderCard";
import ChatPopup from "../../Components/Chat Box/ChatPop";
import { useNavigate } from "react-router-dom";
import PastOrdersCard from "../../Components/OrderComponents/PastOrdersCard";
import { hideSpinner, selectSpinnerVisibility, showSpinner } from "../../Redux/Slices/LoaderSlice";
const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const [toggleCancel, setToggleCancel] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [cancelledClicked, setcancelledClicked] = useState(false); //checks if cancel was ever clicked
  const dispatch = useDispatch();
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState([]);
  const [isScheduledOrdersFetched, setIsScheduledOrdersFetched] =
    useState(false);
  const [isPastOrdersFetched, setIsPastOrdersFetched] = useState(false);
  const [isCacelledOrdersFetched, setIsCancelledOrdersFetched] =
    useState(false);
  const [isActiveOrdersFetched, setIsActiveOrdersFetched] = useState(false);
  const spinnerVisible = useSelector(selectSpinnerVisibility);



  const navigate = useNavigate();
  const { newOrder } = useSelector((state) => state.booking);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  

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
          dispatch(showSpinner());
          // Check if pastOrders is already available locally
          if (!isPastOrdersFetched) {
            result = await dispatch(fetchPastOrdersAsync(token));
            if (result.type === "orders/fetchPastOrders/fulfilled") {
              setPastOrders(result.payload.orders);
              setIsPastOrdersFetched(true);
            }
          }
          dispatch(hideSpinner());
          break;
        case "3":
          dispatch(showSpinner());
          // Check if cancelledOrders is already available locally
          if (!isCacelledOrdersFetched) {
            result = await dispatch(fetchCancelledOrdersAsync(token));
            if (result.type === "orders/fetchCancelledOrders/fulfilled") {
              setCancelledOrders(result.payload.orders);
              setIsCancelledOrdersFetched(true);
            }
          }
          dispatch(hideSpinner());
          break;
        case "4":
          break;
        default:
          break;
      }
    };

    fetchData();
  }, [
    activeTab,
    dispatch,
    scheduledOrders,
    pastOrders,
    cancelledOrders,
    activeOrder,
  ]);

  const scheduleClick = (e) => {
    toggleTab("1");
    // handleFetchOrders("scheduled");
  };

  const pastClick = (e) => {
    toggleTab("2");
    // handleFetchOrders("past");
  };

  const cancelOrders = async () => {
    toggleTab("3");
    if (cancelledClicked === false) {
      setcancelledClicked(true);
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

  const activeOrders = (e) => {
    toggleTab("4");
    //handleFetchOrders("active");
  };

  useEffect(() => {
    const newOrderFound = () => {
      if (newOrder !== null) {
        if (scheduledOrders.length === 0) {
          setScheduledOrders([newOrder]);
          dispatch(setnewOrderValue(null));
        } else {
          console.log(newOrder, "new order");
          setScheduledOrders((prevScheduledOrders) => [
            ...prevScheduledOrders,
            newOrder,
          ]);
          dispatch(setnewOrderValue(null));
        }
      }

      dispatch(setnewOrderValue(null));
    };
    newOrderFound();
  }, [dispatch, newOrder, scheduledOrders.length]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Container>
        <Row>
          <UserNavbar />
        </Row>
        <Row></Row>
        <Row style={{ marginTop: "0.5%" }}>
          <Nav tabs>
            <NavItem>
              <Button
                color="danger"
                style={{ marginRight: "10px" }}
                onClick={goBack}
              >
                Back
              </Button>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                onClick={scheduleClick}
              >
                Scheduled
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                onClick={pastClick}
              >
                Past
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "3" })}
                onClick={cancelOrders}
              >
                Cancelled
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "4" })}
                onClick={activeOrders}
              >
                Active
              </NavLink>
            </NavItem>
          </Nav>
        </Row>
        <Row>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <h2>Scheduled Orders</h2>

                  <div style={{ marginTop: "10px !important" }}>
                    {scheduledOrders.length> 0 ? (
                      <OrderCard
                        scheduledOrdersObject={scheduledOrders}
                        toggleCancel={toggleCancel}
                        setToggleCancel={setToggleCancel}
                        setScheduledOrders={setScheduledOrders}
                        setCancelledOrders={setCancelledOrders}
                      />
                    ) : (
                      <>No Orders Scheduled</>
                    )}
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col>
                  {pastOrders ? (
                    <PastOrdersCard scheduledOrdersObject={pastOrders} />
                  ) : (
                    <h1>No Past Orders</h1>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col>
                  {cancelledOrders ? (
                    <>
                      <CancelledOrders
                        scheduledOrdersObject={cancelledOrders}
                      />
                    </>
                  ) : (
                    <h1>No Cancelled Orders</h1>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="4">
              <Row>
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
                    <span>No Active Orders</span>
                  )}
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Row>
        <ChatPopup />
      </Container>
      {spinnerVisible && <Spinner />}
      {/* Will be use to activate the order when user start the order working */}
    </>
  );
};

export default Orders;
