import {useState} from 'react'
import { Container, Row, Col, Card, CardBody, CardSubtitle, CardTitle, Button } from 'reactstrap'
import {WorkerCardText, WorkerCardButtons} from "./constants"
import Booking from '../booking popup/booking'
import { ChatState } from '../../Context/ChatProvider'
import { useSelector } from 'react-redux'

const WorkerCard = ({worker}) => {
  const { user } = useSelector((state) => state.auth);
  const {copyOfChats,setCopyOfChats,setShowModal ,chat} = ChatState();
  const [modal, setModal] = useState(false);

    const starRating = (numStars) => {
        const stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push(
                <span key={i} className="y">★</span>
            );
        }
        return stars;
    };

    const HandleChat = ()=>{
      setShowModal(true);
      const isWorkerInChats = copyOfChats.some((chat) =>
        chat.users.some((chatUser) => chatUser._id === worker._id));
      if (!isWorkerInChats) {
        // Create a fake chat
        const fakeChat = {
          _id:"",
          users: [worker, user],
          latestMessage: null,
        };
        // Add the fake chat to the chats array
        setCopyOfChats([fakeChat, ...copyOfChats]);
      } else {
        // Worker is already in a chat, no action needed
        console.log("Worker is already in a chat");
      }
    }

    const toggleModal = () => {
        setModal(!modal);
      };
     
      const book = () => {
        toggleModal(); 
      };
      
    return (
        <Container className='mt-2'>
            <Row>
                <Col md={10}>
                    {worker?.status == "online" ?
                        <>
                         <Card className='d-flex flex-column flex-md-row'>
                                <CardBody className='py-1 '>
                                    <CardTitle className='fw-bold pt-0 fs-3'>
                                        {worker.firstName + " " + worker.lastName}
                                    </CardTitle>
                                    <CardSubtitle>
                                        <b>Status: </b> {worker.status}
                                    </CardSubtitle>
                                    <CardSubtitle>
                                    <b>{WorkerCardText.Services}</b>
                                        {worker?.services.map((service,key) =>
                                        (
                                            <div key={key} className='d-flex flex-row gap-5 '>
                                                <CardSubtitle>
                                                    {service.name}
                                                </CardSubtitle>
                                                <CardSubtitle>
                                                    {service.rate + "$"}
                                                </CardSubtitle>

                                            </div>
                                        ))}
                                    </CardSubtitle>
                                    <CardSubtitle>
                                    <b>Rating:</b> { worker.rating > 0 ? starRating(worker.rating) : "not rated yet"}
                                    </CardSubtitle>
                                    <CardSubtitle>
                                    <b>Distance:</b> { worker.distance} 
                                    </CardSubtitle>
                                </CardBody>
                                <CardBody className='py-1' d-flex >
                                    <div className='gap-3 d-flex flex-md-column pt-md-4' >
                                        <Button color='primary' onClick={HandleChat}>
                                            {WorkerCardButtons.chat}
                                        </Button>
                                        <Button color='primary' onClick={book}>
                                            {WorkerCardButtons.book}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </>
                        : ''}
                </Col>
            </Row>
            <Booking modal={modal} toggle={toggleModal} worker={worker} chat={chat} />
        </Container>
    )
}
export default WorkerCard