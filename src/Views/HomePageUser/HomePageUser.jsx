import { FaSearch } from "react-icons/fa";
import Filter from "../../Components/Filter/Filter.jsx";
import WorkerCard from "../../Components/workerCard/workerCard";
import { button, heading } from "./constants.js";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatsAsync } from "../../Redux/Slices/ChatSlice.js";
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../Components/Navbar/UserNavbar";
import {
  getAllWorker,
  WorkersByType,
} from "../../Redux/Slices/homepageSlice.js";
import { useDebounce } from "../../Hooks/Debounce.jsx";
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
} from "reactstrap";
import ChatPopup from "../../Components/Chat Box/ChatPop.jsx";
import { ChatState } from "../../Context/ChatProvider.jsx";
import ModalComponent from "../../Components/ModalComponent/ModalComponent.jsx";
import FinishJobReq from "../../Components/FinishJobReq/FinishJobReq.jsx";
import socket from "../../SocketManager/socketManager.js";
import { activateOrderAsync } from "../../Redux/Slices/orderSlice.js";
import Swal from "sweetalert2";
import {allServicesAsync} from "../../Redux/Slices/Admin.js"
const HomePageUser = () => {
 
  let list = useSelector((state) => state?.admin?.services);
  console.log(list);
  const dispatch = useDispatch();
  const { setOriginalChats, setCopyOfChats, OriginalChats } = ChatState();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  let users = useSelector((state) => state?.homepage?.workers);
  const chats = useSelector((state) => state?.chat?.ChatsWithWorkers);
  const { newOrder } = useSelector((state) => state.booking);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("none");
  const [sortOption2, setSortOption2] = useState("none");
  const [searchInput, setSearchInput] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [rateFilter, setRateFilter] = useState(0);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllWorker({ userId: user._id, token }));
      dispatch(fetchChatsAsync({ user, token }));
      dispatch(allServicesAsync());
    } else {
      console.error("User object or _id is missing");
    }
  }, [dispatch]);

  useEffect(() => {
    if (chats) {
      setOriginalChats(chats);
      setCopyOfChats(OriginalChats);
    }
  }, [chats]);

  //popup states
  const [finishOrderReq, setFinishOrderReq] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState("");
  const [fOrder, setFOrder] = useState("");

  useEffect(() => {
    socket.on("startjob-request", (order) => {
      setOrder(order);
      toggleModal();
    });
    return () => {
      socket.off("startjob-request");
    };
  });

  useEffect(() => {
    socket.on("order-canceled", (order) => {
      if (order) {
        Swal.fire({
          title: "Order Canceled",
          html: `<div> <strong>Order Title:</strong> ${order.Title}</div>
                 <div> <strong>Order Details:</strong> ${order.details}</div>
                 <div> <strong>Service:</strong> ${order.service}</div>
                 <div> <strong>Amount:</strong> ${order.amount}</div>`,
          icon: "error",
        });
      }
    });
    return () => {
      socket.off("order-canceled");
    };
  });

  useEffect(() => {
    if (!socket) return;
    socket.on("finishjob-request", (order) => {
      console.log(order);
      setFinishOrderReq(true);
      setFOrder(order);
    });
    return () => {
      socket.off("finishjob-request");
    };
  }, []);

  useEffect(() => {
    if (newOrder !== null) {
      console.log(newOrder);
      const data = { newOrder: newOrder, Uid: newOrder.users[1]._id };
      socket.emit("new-order-created", data);
    }
    return () => {
      socket.off("new-order-created");
    };
  }, [newOrder]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const activatingOrder = async () => {
    const result = await dispatch(activateOrderAsync({ orderId: order._id }));
    if (result.type === "orders/activateOrders/fulfilled") {
      if (result.payload.Status === "Active") {
        const data = {
          order: order,
          result: "true",
        };
        const startJobSocket = () => {
          if (!socket) return;
          socket.emit("startjob-response", data);

          setIsModalOpen(false);
          return () => {
            socket.off("startjob-response");
          };
        };
        startJobSocket();
      }
    }
  };

  const cancel = async () => {
    const data = {
      result: "false",
      order: order,
    };
    socket.emit("startjob-response", data);
    setIsModalOpen(false);
    return () => {
      socket.off("startjob-response");
    };
  };

  //search
  let debouncedsearch = useDebounce(searchInput);
  let memoizedSuggestions = useMemo(() => {
    const nameValues = list?.map(service => service.name);
    return nameValues?.filter((item) =>
      item.toLowerCase().includes(debouncedsearch.toLowerCase())
    );
  }, [debouncedsearch]);

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    memoizedSuggestions = null;
  };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = () => {
    const type = searchInput;
    const params = { userId: user._id, type, token };
    dispatch(WorkersByType(params));
  };

  const clearFilters = () => {
    setSortOption("none");
    setDistanceFilter(0);
    setRateFilter(0);
  };

  //filter
  const filteredAndSortedUsers = useMemo(() => {
    let filteredUsers = users;

    if (sortOption !== "none" && sortOption === "highToLowRating") {
      filteredUsers = [...filteredUsers].sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
    } else if (sortOption !== "none" && sortOption === "lowToHighRating") {
      filteredUsers = [...filteredUsers].sort(
        (a, b) => Number(a.rating) - Number(b.rating)
      );
    }

    if (sortOption2 !== "none" && sortOption2 === "highToLowDistance") {
      filteredUsers = [...filteredUsers].sort(
        (a, b) => Number(b.distance) - Number(a.distance)
      );
    } else if (sortOption2 !== "none" && sortOption2 === "lowToHighDistance") {
      filteredUsers = [...filteredUsers].sort(
        (a, b) => Number(a.distance) - Number(b.distance)
      );
    }

    if (distanceFilter !== 0) {
      filteredUsers = filteredUsers.filter(
        (worker) => Number(worker.distance) <= distanceFilter
      );
    }

    if (rateFilter !== 0) {
      filteredUsers = filteredUsers.filter((worker) => {
        const filteredUser = worker.services.some((services) => {
          return services.rate <= Number(rateFilter);
        });
        return filteredUser;
      });
    }

    return filteredUsers;
  }, [
    users,
    debouncedsearch,
    sortOption,
    sortOption2,
    distanceFilter,
    rateFilter,
  ]);

  return (
    <>
      <Navbar />
      <Container>
        {/* First Row */}
        <Row className="mb-1 mt-1">
          <Col className="text-start" xs={3}>
            <Button
              onClick={() => navigate("/user/Orders")}
              color="primary"
              className="p-1"
            >
              {button.orders}
            </Button>
          </Col>
          <Col className="   d-flex flex-column py-0" xs={6}>
            <div className="d-flex">
              <Input
                type="text"
                className="px-sm-5 text-contain"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button
                color="primary"
                className="py-1 rounded text-white"
                onClick={handleSearch}
              >
                <FaSearch />
              </Button>
            </div>
            <div className="w-75">
              {debouncedsearch && memoizedSuggestions.length > 0 && (
                <ul className=" ">
                  {memoizedSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="ps-2 mb-1  text-start border rounded "
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
          <Col className="text-end d-md-none" xs={3}>
            <Button
              className="p-1"
              color="primary"
              onClick={handleFiltersToggle}
            >
              {button.filters}
            </Button>
            <Offcanvas
              isOpen={showFilters}
              direction="end"
              fade={false}
              toggle={handleFiltersToggle}
            >
              <OffcanvasHeader toggle={handleFiltersToggle}>
                {heading.filter}
              </OffcanvasHeader>
              <OffcanvasBody>
                <Filter
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  sortOption2={sortOption2}
                  setSortOption2={setSortOption2}
                  distanceFilter={distanceFilter}
                  setDistanceFilter={setDistanceFilter}
                  rateFilter={rateFilter}
                  setRateFilter={setRateFilter}
                  clearFilters={clearFilters}
                ></Filter>
              </OffcanvasBody>
            </Offcanvas>
          </Col>
        </Row>
        <Row>
          <Col className="mt-3" md={7}>
            {filteredAndSortedUsers ? (
              filteredAndSortedUsers?.map((worker, index) => (
                <WorkerCard worker={worker} key={index} />
              ))
            ) : (
              <h3> No Workers found!</h3>
            )}
          </Col>
          <Col className="d-none d-md-block   mt-3" md={5}>
            <h3>{heading.filter}</h3>
            <Filter
              sortOption={sortOption}
              setSortOption={setSortOption}
              sortOption2={sortOption2}
              setSortOption2={setSortOption2}
              distanceFilter={distanceFilter}
              setDistanceFilter={setDistanceFilter}
              rateFilter={rateFilter}
              setRateFilter={setRateFilter}
              clearFilters={clearFilters}
            ></Filter>
          </Col>
        </Row>
        {/* chat popup is here */}
        <ChatPopup />
      </Container>
      <ModalComponent
        modalHeader={"Order Activation"}
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        finalizeFunction={activatingOrder}
        cancel={cancel}
        cancelButtonLabel={"Cancel Order Start"}
        finalizeButtonLabel={"Finalize Order Start"}
        order={order}
      />
      {finishOrderReq ? (
        <>
          <FinishJobReq order={fOrder} setFinishOrderReq={setFinishOrderReq} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default HomePageUser;
