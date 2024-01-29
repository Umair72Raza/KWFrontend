import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import completedtask from "../../assets/completedtask.png";
import activeOrder from "../../assets/activestatus.png";
import {
  cancelOrderAsync,
} from "../../Redux/Slices/OrderSlice";
import { truncateText } from "../../utils";
import { PopUpState } from "../../Context/PopUpProvider";
const OrderCard = ({
  scheduledOrdersObject,
  toggleCancel,
  setToggleCancel,
  setScheduledOrders,
  setCancelledOrders,
}) => {
  const socket = useSelector((state) => state?.socket?.socket);
  //get these from local storage
  const { user, token } = useSelector((state) => state.auth);
  const userId = user._id;
  const [showFullDetailsMap, setShowFullDetailsMap] = useState({});
 
  let {
    setModalHeader,
    setIsModalOpen,
    setInputLabel,
    modalInputValue,
    setModalInputValue,
    setCancelButtonLabel,
    setFinalizeButtonLabel,
    setShowInput,
     toggleModal,
      orderToCancel,
       setOrderToCancel,
        finalizeFunction,
        setFinalizeFunction } = PopUpState()



  const toggleDetails = (orderId) => {
    setShowFullDetailsMap((prevMap) => ({
      ...prevMap,
      [orderId]: !prevMap[orderId],
    }));
  };

  const transformOrderDetails = (order) => {
    let transformedDetails = order.details.replace(/<br\s*\/?>/g, "\n");

    return showFullDetailsMap[order._id]
      ? order.details
      : truncateText(transformedDetails, 25);
  };

  const dispatch = useDispatch();


  const CancelOrder = (Order) => {

    setOrderToCancel(Order)
    setModalHeader("Order Cancellation")
    setInputLabel("Reason for Cancellation")
    setShowInput(true)
    setFinalizeButtonLabel("Finalize Order Cancellation")
    setCancelButtonLabel("Cancel Order Cancellation")
    toggleModal()
  }
  const Clear =()=>
  {
    setOrderToCancel(null)
    setModalHeader("")
    setInputLabel("")
    setShowInput(false)
    setFinalizeButtonLabel("")
    setCancelButtonLabel("")
    setFinalizeFunction(false)
  }

  useEffect(() => {
    if (finalizeFunction == true) {
     cancelingOrder();
    }
  }, [finalizeFunction])

  const cancelingOrder = () => {
    //dispatch cancel order
    const order = orderToCancel;
    const data = {
      userId: userId,
      orderId: order._id,
      cancelReason: modalInputValue,
      Status: "Cancelled",
    };

    const resonWithOrdertoCancel = {
      reason: modalInputValue,
      order: order
    }
    console.log(resonWithOrdertoCancel, "cancel order")

    const cancelOrderSocketEvent = () => {
      if (!socket) return;
      socket?.emit("cancel-order-user", resonWithOrdertoCancel);
      return () => {
        socket?.off("cancel-order-user");
      };
    };
    const dataWithToken = { token: token, data: data };
    dispatch(cancelOrderAsync(dataWithToken));
    cancelOrderSocketEvent();
    
    setModalInputValue("");
    setIsModalOpen(false);

    setScheduledOrders((prevScheduledOrders) =>
      prevScheduledOrders.filter(
        (scheduledOrder) => scheduledOrder._id !== order._id
      )
    );

    setCancelledOrders((prevCancelledOrders) => [
      ...prevCancelledOrders,
      order,
    ]);
    Clear();
    setToggleCancel(!toggleCancel);
  };

  return (
    <>
      <Container>
        {scheduledOrdersObject.length > 0 ? <>
          <Row>
            {scheduledOrdersObject?.map((order) => (
              <Col
                key={order._id}
                sm="6"
                md="4"
                lg="4"
                xl="4"
                style={{ marginTop: "10px" }}
              >
                <Card
                  className="shadow"
                  style={{ backgroundColor: "#f6f8fc", color: "", height: "100%" }}
                >
                  <CardBody>
                    <CardTitle>
                      <Col>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={completedtask}
                            alt="schTask"
                            style={{ marginRight: "10px" }}
                          />
                          <h5 style={{
                            marginTop: "4%",
                            textAlign: "center",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}>{order.Title}</h5>
                        </div>
                      </Col>{" "}
                    </CardTitle>
                    <CardText>
                      <Col>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ marginTop: "10px", marginRight: "1%" }}>
                            Status: {order.Status}
                          </span>
                          <img
                            src={activeOrder}
                            alt="schTask"
                            style={{
                              height: "12px",
                              marginLeft: "-1%",
                              zIndex: "0",
                              marginTop: "3.75%",
                              opacity: "90%",
                            }}
                          />
                        </div>
                      </Col>
                    </CardText>
                    <CardText>Time: {order.Time}</CardText>
                    <CardText>Date: {order.date}</CardText>
                    <CardText>
                      Details:{" "}
                      <div
                        style={{
                          maxHeight: "100px",
                          overflowY: "auto",
                        }}
                      >

                        {showFullDetailsMap[order._id]
                          ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: order.details,
                              }}
                            />
                          )
                          : transformOrderDetails(order)}
                        {order.details.length > 5 && (
                          <Button
                            style={{ marginTop: "-5px" }}
                            color="link"
                            onClick={() => toggleDetails(order._id)}
                          >
                            {showFullDetailsMap[order._id] ? "Show Less" : "Show More"}
                          </Button>
                        )}
                      </div>
                    </CardText>
                    {/* <CardText>OrderId: {order._id}</CardText> */}
                    <CardText>
                      Worker: {order?.users?.length > 0 && order?.users[1]?.firstName}
                    </CardText>
                    <Row>
                      <Col></Col>
                      <Col>
                        {" "}
                        {/* Full width on small screens, half width on medium and larger screens */}
                        <CardText>
                          <Button
                            onClick={()=>{
                              //setOrderToCancel(order)
                              CancelOrder(order)}}
                          color="danger"
                        >
                          Cancel Order
                        </Button>
                      </CardText>
                    </Col>
                    <Col></Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </>:<>No Scheduled Orders</>}

    </Container >
    {/* <ModalComponent
       
      /> */}
    </>
  );
};

export default OrderCard;
