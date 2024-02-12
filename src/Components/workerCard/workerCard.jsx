import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Button,
  CardText,
} from "reactstrap";
import { workerCardConstants } from "../../Constants/Constants";
import Booking from "../booking popup/booking";
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";
import { SelectChat } from "../../utils";
import { set } from "lodash";
import { auto } from "@popperjs/core";

const WorkerCard = ({ worker }) => {
  const { user } = useSelector((state) => state.auth);
  const {
    copyOfChats,
    setCopyOfChats,
    setShowModal,
    chat,
    setSelectedChat,
    setSelectedChatCompare,
    setChat,
    chatFromWorkerCard,
    setChatFromWorkerCard,setNotification
  } = ChatState();
  const [modal, setModal] = useState(false);
  const [bookingWorker, SetBookingWorker] = useState();
  const starRating = (numStars) => {
    const stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push(
        <span key={i} className="y">
          ★
        </span>
      );
    }
    return stars;
  };


  const HandleChat = () => {
    setShowModal(true);
    setChatFromWorkerCard(true);
  
    const isWorkerInChats = copyOfChats?.some(
      (chat) => chat?.users?.some((chatUser) => chatUser?._id === worker?._id)
    );
  
    if (!isWorkerInChats) {
      // Create a fake chat
      const fakeChat = {
        _id: "",
        chatName: "fakeChat",
        users: [worker, user],
        latestMessage: null,
        seen: true,
      };
  
      setCopyOfChats((prevCopyOfChats) => {
        const updatedChats = prevCopyOfChats.length > 0
          ? [fakeChat, ...prevCopyOfChats]
          : [fakeChat];
        
        setChat(fakeChat);
        setSelectedChatCompare(fakeChat);
        setSelectedChat(() => SelectChat(fakeChat));
  
        return updatedChats;
      });
    } else {
      const workerChat = copyOfChats.find(
        (chat) => chat?.users?.some((chatUser) => chatUser?._id === worker?._id)
      );
  
      if (worker.access === "accepted") {
        setChat(workerChat);
        setSelectedChatCompare(workerChat);
        setSelectedChat(() => SelectChat(workerChat));
        setNotification((prevNotifications) =>
        prevNotifications.filter((n) => n?.chat?._id !== workerChat?._id)
      );
      if (unreadMessages[workerChat._id]) {
        setUnreadMessages((prevCount) => ({
          ...prevCount,
          [workerChat._id]: 0,
        }));
      }
      }
    }
  };
  
 
  
  const toggleModal = () => {
    setModal(!modal);
  };

  const book = (worker) => {
    SetBookingWorker(worker);
    toggleModal();
  };
  

  return (
    <Container className="mt-2 ">
      <Row className="d-flex justify-content-center">
          {worker && worker?.status == "online" ? (
            <>
              <Card className="d-flex flex-column flex-md-row  h-100" >
                <CardBody className=" h-100 "  >
                  <CardTitle className="fw-bold  fs-3" style={{minHeight:'65px', maxHeight:'65px'} }>
                    {worker.firstName + " " + worker.lastName}
                  </CardTitle>
                  <CardSubtitle className="d-flex flex-row  justify-content-between" >
                    <CardText className="fw-bold" >Status:</CardText> {worker.status == "online" ? <CardText className="text-success" >{worker.status}</CardText>:[]}
                  </CardSubtitle>
                  <CardSubtitle><b className="fw-bold">{workerCardConstants.WorkerCardText.Services}</b></CardSubtitle>
                  <CardSubtitle className=" mt-1" style={{ minHeight: '60px' ,maxHeight: '60px' ,overflowY:'auto'}}>
                    {worker?.services.map((service, key) => (
                      <div
                        key={key}
                        className="d-flex flex-row  justify-content-between"
                        
                      >
                        <div>
                          <CardSubtitle>{service.name}</CardSubtitle>
                        </div>
                        <div>
                          <CardSubtitle>{service.rate + "$"}</CardSubtitle>
                        </div>
                      </div>
                    ))}
                  </CardSubtitle>
                  <CardSubtitle className="d-flex flex-row justify-content-between">
                    <div>
                      <b className="fw-bold mt-1">Rating:</b>{" "}
                    </div>
                    <div>
                      {worker.rating > 0
                        ? starRating(worker.rating)
                        : "not rated yet"}
                    </div>
                  </CardSubtitle>
                  <CardSubtitle className="d-flex flex-row  justify-content-between">
                    <div className="fw-bold mt-1">Distance: </div> <div>{worker.distance} </div>
                  </CardSubtitle>
                  <div className="gap-1 d-flex flex-md-column ">
                    <Button color="primary" onClick={HandleChat}>
                      {workerCardConstants.WorkerCardButtons.chat}
                    </Button>
                    <Button color="primary" onClick={() => book(worker)}>
                      {workerCardConstants.WorkerCardButtons.book}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </>
          ) : (
            []
          )}
      </Row>
      <Booking
        modal={modal}
        toggle={toggleModal}
        worker={bookingWorker}
        chat={chat}
      />
    </Container>
  );
};
export default WorkerCard;
