import { FaSearch } from "react-icons/fa";
import Filter from "../../Components/Filter/Filter.jsx";
import WorkerCard from "../../Components/workerCard/workerCard";
import { HomePageUserConst, filterConstants } from "../../Constants/Constants.js";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatsAsync } from "../../Redux/Slices/ChatSlice.js";
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../../Components/Navbar/UserNavbar";
import {
  getAllWorker,
  updateWorkers,
  WorkersByType,
  updateRemoveWorker,
} from "../../Redux/Slices/HomepageSlice.js";
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
  Spinner,
} from "reactstrap";
import { ChatState } from "../../Context/ChatProvider.jsx";
import ModalComponent from "../../Components/ModalComponent/ModalComponent.jsx";
import { allServicesAsync } from "../../Redux/Slices/AdminSlice.js";
const HomePageUser = () => {
  let list = useSelector((state) => state?.admin?.services);
  const socket = useSelector((state) => state?.socket?.socket);
  const dispatch = useDispatch();
  const { setOriginalChats, setCopyOfChats, setUnreadMessages } = ChatState();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  let users = useSelector((state) => state?.homepage?.workers);
  const chats = useSelector((state) => state?.chat?.ChatsWithWorkers);

  const [showFilters, setShowFilters] = useState(false);
  const [show, setShow] = useState(true)
  const [sortOption, setSortOption] = useState("none");
  const [sortOption2, setSortOption2] = useState("none");
  const [searchInput, setSearchInput] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [rateFilter, setRateFilter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchWorker, setSearchWorker] = useState(null)
  let removedUsers = [];
  removedUsers = useSelector((state) => state?.homepage?.removeWorker);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading spinner
        if (user && user._id && token) {
          await dispatch(getAllWorker({ userId: user._id, token }));
          await dispatch(fetchChatsAsync({ user, token }));
          await dispatch(allServicesAsync());
          await setSearchWorker(users)
        } else {
          console.error("User object or _id is missing");
        }
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
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
      socket?.off("notifications")
    };
  }, [chats]);

  useEffect(() => {
    socket?.on("status-change", (User) => {
      if (users && User.status === "offline") {
        let remove = [];
        const userIndexRemoved = users.findIndex((u) => u._id === User._id);
        if (userIndexRemoved !== -1) {
          const filteredUsers = users.filter((u) => u._id !== User._id);
          remove.push(users[userIndexRemoved]);
          dispatch(updateWorkers(filteredUsers));
          dispatch(updateRemoveWorker(remove));
        }
      } else if (removedUsers && User.status === "online") {
        let worker = users;
        const userIndexInRemoved = removedUsers?.findIndex(
          (u) => u._id === User._id
        );
        if (userIndexInRemoved !== -1) {
          worker = [removedUsers[userIndexInRemoved], ...worker];
          const remove = removedUsers.filter((u) => u._id !== User._id);
          dispatch(updateWorkers(worker));
          dispatch(updateRemoveWorker(remove));
        }
      }
    });
    return () => {
      socket?.off("status-change");
    };
  });


  //search
  // let debouncedsearch = useDebounce(searchInput);
  // let memoizedSuggestions = useMemo(() => {

  //   const nameValues = list?.map((service) => service.name);
  //   return nameValues?.filter((item) =>
  //     item.toLowerCase().includes(debouncedsearch.toLowerCase())
  //   );

  // }, [debouncedsearch]);

  // const handleSuggestionClick = (suggestion) => {
  //   setSearchInput(suggestion);
  //   memoizedSuggestions = null;
  //   setShow(false)
  // };

  const handleFiltersToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = () => {
    let workers = [];
    if (searchInput?.length >= 3) {
      workers = users?.filter((worker) => {
        // Check if the searchInput is included in the worker's name or address
        const fnameMatch = worker?.firstName?.toLowerCase()?.includes(searchInput?.toLowerCase());
        const lnameMatch = worker?.lastName?.toLowerCase()?.includes(searchInput?.toLowerCase());
        const addressMatch = worker?.address?.toLowerCase()?.includes(searchInput?.toLowerCase());

        // Check if the searchInput is included in any of the service names
        const serviceMatch = worker?.services?.some(service => service?.name?.toLowerCase()?.includes(searchInput?.toLowerCase()));

        // Return true if any of the conditions are met
        console.log(fnameMatch, lnameMatch, addressMatch, serviceMatch)
        return fnameMatch || lnameMatch || addressMatch || serviceMatch;
      });
      setSearchWorker(workers)
    }
    else {
      setSearchWorker(null)
    }
    console.log(workers, "workers")

    // Do something with the filtered workers array
    // For example, update the state or dispatch an action
  };

  const clearFilters = () => {
    setSortOption("none");
    setSortOption2("none");
    setDistanceFilter(0);
    setRateFilter(0);
  };

  //filter
  const filteredAndSortedUsers = useMemo(() => {
    let filteredUsers = users;
    if (searchWorker?.length > 0) {
      filteredUsers = searchWorker;
      //setSearchWorker(null)
    }
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
      if (rateFilter == 21) {
        filteredUsers = filteredUsers.filter((worker) => {
          const filteredUser = worker.services.some((services) => {
            return services.rate >= Number(rateFilter);
          });
          return filteredUser;
        });
      } else {
        filteredUsers = filteredUsers.filter((worker) => {
          const filteredUser = worker.services.some((services) => {
            return services.rate <= Number(rateFilter);
          });
          return filteredUser;
        });
      }
    }
    return filteredUsers;
  }, [
    users,
    // debouncedsearch,
    sortOption,
    sortOption2,
    distanceFilter,
    rateFilter,
    searchWorker
  ]);

  return (
    <>
      <Navbar />
      <Container className="px-3">
        {/* First Row */}
        <Row className="px-3">
          <Col className="px-3">
            <Row className="mb-1 mt-1 px-3">
              <Col className="text-start  " xs={3}>
                <Button
                  onClick={() => navigate("/user/Orders")}
                  color="primary"
                  className="p-1"
                >
                  {HomePageUserConst.button.orders}
                </Button>
              </Col>
              <Col className="   d-flex flex-column py-0" xs={6}>
                <div className="d-flex gap-1 ">
                  <Input
                    type="text"
                    className="search-border"
                    placeholder="Search For Category"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      setShow(true)
                    }}
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
                  {/* {debouncedsearch && memoizedSuggestions.length > 0 && show == true && (
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
              )} */}
                </div>
              </Col>
              <Col className="text-end d-md-none" xs={3}>
                <Button
                  className="p-1"
                  color="primary"
                  onClick={handleFiltersToggle}
                >
                  {HomePageUserConst.button.filters}
                </Button>
                <Offcanvas
                  isOpen={showFilters}
                  direction="end"
                  fade={false}
                  toggle={handleFiltersToggle}
                >
                  <OffcanvasHeader toggle={handleFiltersToggle}>
                    {HomePageUserConst.heading.filter}
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
            <Row className="d-none d-md-block mt-3 d-flex px-3" >

              <Col className=" d-flex flex-row gap-5">
                <div className="fw-bold fs-3"> {HomePageUserConst.heading.filter}</div>
                <Button className='d-none d-sm-block my-2 ' color="danger" onClick={clearFilters}>
                  {filterConstants.button.clear}
                </Button>
              </Col>
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


            </Row>

            <Row>
              {/* <Col className="mt-3"> */}
              {loading ? (
                <div className="d-flex flex-row justify-content-center">
                  <Spinner
                    style={{
                      height: "3rem",
                      width: "3rem",
                    }}
                  />
                </div>
              ) : filteredAndSortedUsers && filteredAndSortedUsers?.length > 0 ? (
                filteredAndSortedUsers.map((worker, index) => (
                  <Col md={4} lg={3}><WorkerCard worker={worker} key={index} /> </Col>
                ))
              ) : (
                <h3>No Workers found!</h3>
              )}
              {/* </Col> */}

            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePageUser;
