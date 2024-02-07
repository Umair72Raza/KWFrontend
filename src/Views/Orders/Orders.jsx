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
  fetchPendingOrdersAsync,
  fetchPostedOrdersAsync,
} from "../../Redux/Slices/OrderSlice";
import CancelledOrders from "../../Components/OrderComponents/CancelledOrders";
import UserNavbar from "../../Components/Navbar/UserNavbar";
import ActiveOrders from "../../Components/OrderComponents/ActiveOrders";
import { setnewOrderValue } from "../../Redux/Slices/BookingSlice";
import OrderCard from "../../Components/OrderComponents/OrderCard";
import { useNavigate } from "react-router-dom";
import PastOrdersCard from "../../Components/OrderComponents/PastOrdersCard";
import PendingOrderCard from "../../Components/OrderComponents/PendingOrders";
import {
  hideSpinner,
  selectSpinnerVisibility,
  showSpinner,
} from "../../Redux/Slices/LoaderSlice";
import { TABS } from "../../Constants/Constants";
import { PopUpState } from "../../Context/PopUpProvider";
import PostedJobs from "../PostedJobs/PostedJobs";

const Orders = () => {
  const { token } = useSelector((state) => state.auth);
  const [toggleCancel, setToggleCancel] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [cancelledClicked, setcancelledClicked] = useState(false); //checks if cancel was ever clicked
  const [postedClicked,setPostedClicked] = useState(false)
  const dispatch = useDispatch();
  //const [pastOrders, setPastOrders] = useState([]);
  // const [activeOrder, setActiveOrder] = useState([]);
  const [isScheduledOrdersFetched, setIsScheduledOrdersFetched] =
    useState(false);
  const [isPastOrdersFetched, setIsPastOrdersFetched] = useState(false);
  const [isCacelledOrdersFetched, setIsCancelledOrdersFetched] =
    useState(false);
  const [isPendingOrdersFetched, setIsPendingOrdersFetched] = useState(false);
  const [isActiveOrdersFetched, setIsActiveOrdersFetched] = useState(false);
  const spinnerVisible = useSelector(selectSpinnerVisibility);
  let {
    cancelledOrders,
    setCancelledOrders,
    scheduledOrders,
    setScheduledOrders,
    activeOrder,
    setActiveOrder,
    pastOrders,
    setPastOrders,
    pendingOrders,
    setPendingOrders,
    postedJobs,
    setPostedJobs
  } = PopUpState();

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
        case "5":
          dispatch(showSpinner());
          // Check if pendingOrders is already available locally
          if (!isPendingOrdersFetched) {
            result = await dispatch(fetchPendingOrdersAsync(token));
            if (result.type === "orders/fetchPendingOrders/fulfilled") {
              setPendingOrders(result.payload.orders);
              setIsPendingOrdersFetched(true);
            }
          }
          dispatch(hideSpinner());
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
  };

  const pastClick = (e) => {
    toggleTab("2");
  };


  const postedClick = async () => {
    toggleTab("6");
    if (postedClicked === false) {
      setPostedClicked(true);
      let result = await dispatch(fetchPostedOrdersAsync(token));
      if (result.type === "orders/fetchPostedOrders/fulfilled") {
  
        if (postedJobs.length === 0) {

          setPostedJobs(result.payload.orders);
        } else {
          const uniqueOrders = result.payload.orders.filter(
            (newOrder) =>
              !postedJobs.some(
                (existingOrder) => existingOrder._id === newOrder._id
              )
          );

          // Append the unique orders to pastOrders
          setPostedJobs((prevPostedOrders) => [
            ...prevPostedOrders,
            ...uniqueOrders,
          ]);
        }
      }
    }
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
  };
  const PendingOrders = (e) => {
    toggleTab("5");
  };

  useEffect(() => {
    const newOrderFound = () => {
      if (newOrder !== null && newOrder.Status === "Scheduled") {
        if (scheduledOrders.length === 0) {
          setScheduledOrders([newOrder]);
          dispatch(setnewOrderValue(null));
        } else {
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
        <Row className="d-flex justify-content-between mt-2">
          <Col>
            <Button color="danger" onClick={goBack}>
              Back
            </Button>
          </Col>
        </Row>

        <Row></Row>
        <Row style={{ marginTop: "0.5%" }}>
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
              >
                {TABS.ACTIVE}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "5" })}
                onClick={PendingOrders}
              >
                {TABS.Pending}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "6" })}
                onClick={postedClick}
              >
                Posted Jobs
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

                  <div style={{ marginTop: "10px !important" }}>
                    {scheduledOrders.length > 0 ? (
                      <OrderCard
                        scheduledOrdersObject={scheduledOrders}
                        toggleCancel={toggleCancel}
                        setToggleCancel={setToggleCancel}
                        setScheduledOrders={setScheduledOrders}
                        setCancelledOrders={setCancelledOrders}
                      />
                    ) : (
                      <>{TABS.NO_SCH_ORDERS}</>
                    )}
                  </div>
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
                      <CancelledOrders
                        scheduledOrdersObject={cancelledOrders}
                      />
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
            <TabPane tabId="5">
              <Row>
                <h2 style={{ textAlign: "center" }}>{TABS.Pending}</h2>
                <Col>
                  {pendingOrders ? (
                    <>
                      <PendingOrderCard pendingOrders={pendingOrders} />
                    </>
                  ) : (
                    <span>No Pending Orders</span>
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="6">
              <Row>
                <h2 style={{ textAlign: "center" }}>Posted Jobs</h2>
                <Col>
                  {postedJobs ? (
                    <>
                      <PostedJobs postedJobs={postedJobs} />
                    </>
                  ) : (
                    <span>No Posted Jobs</span>
                  )}
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Row>
        <div style={{ textAlign: "center" }}>
          {spinnerVisible && <Spinner />}
        </div>
      </Container>
    </>
  );
};

export default Orders;
