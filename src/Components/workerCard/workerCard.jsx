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
} from "reactstrap";
import { WorkerCardText, WorkerCardButtons } from "./constants";
import Booking from "../booking popup/booking";
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";
import { SelectChat } from "../../utils";

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
    const isWorkerInChats = copyOfChats?.some((chat) =>
      chat?.users?.some((chatUser) => chatUser?._id === worker?._id)
    );
    if (!isWorkerInChats) {
      // Create a fake chat
      const fakeChat = {
        _id: "",
        users: [worker, user],
        latestMessage: null,
      };
      // Add the fake chat to the chats array
      if(copyOfChats?.length>0){
        setCopyOfChats([fakeChat, ...copyOfChats]);
        setChat(fakeChat);
      setSelectedChatCompare(fakeChat);
      setSelectedChat(() => SelectChat(fakeChat));
      } else {
        setCopyOfChats([fakeChat]);
        setChat(fakeChat);
      setSelectedChatCompare(fakeChat);
      setSelectedChat(() => SelectChat(fakeChat));
      }
    } else {
      if(worker.access=== "accepted"){
      const chat = copyOfChats.find((chat) =>
        chat?.users?.some((chatUser) => chatUser?._id === worker?._id)
      );
      setChat(chat);
      setSelectedChatCompare(chat);
      setSelectedChat(() => SelectChat(chat));
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
    <Container className="mt-2">
      <Row className="d-flex justify-content-center">
        <Col md={7} lg={7} xl={7} className="">
          {worker && worker?.status == "online" ? (
            <>
              <Card className="d-flex flex-column flex-md-row">
                <CardBody className="py-1 ">
                  <CardTitle className="fw-bold pt-0 fs-3">
                    {worker.firstName + " " + worker.lastName}
                  </CardTitle>
                  <CardSubtitle className="d-flex flex-row  justify-content-between">
                    <div>Status:</div> <div>{worker.status}</div>
                  </CardSubtitle>
                  <CardSubtitle>
                    <b>{WorkerCardText.Services}</b>
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
                      <b>Rating:</b>{" "}
                    </div>
                    <div>
                      {worker.rating > 0
                        ? starRating(worker.rating)
                        : "not rated yet"}
                    </div>
                  </CardSubtitle>
                  <CardSubtitle className="d-flex flex-row  justify-content-between">
                    <div>Distance: </div> <div>{worker.distance} </div>
                  </CardSubtitle>
                  <div className="gap-3 d-flex flex-md-column pt-md-4">
                    <Button color="primary" onClick={HandleChat}>
                      {WorkerCardButtons.chat}
                    </Button>
                    <Button color="primary" onClick={() => book(worker)}>
                      {WorkerCardButtons.book}
                    </Button>
                  </div>
                </CardBody>
                {/* <CardBody className="py-1" d-flex>
                 
                </CardBody> */}
              </Card>
            </>
          ) : (
            {}
          )}
        </Col>
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
