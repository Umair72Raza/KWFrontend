import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";
import { toggleStatusAsync } from "../../Redux/Slices/AuthSlice";

const OnOffButton = ({ user }) => {
  const { token } = useSelector((state) => state.auth);
  const [isOn, setIsOn] = useState(false);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state?.socket?.socket);
  useEffect(() => {
    user.status === "online" ? setIsOn(true)  : setIsOn(false);
    socket?.emit("online-offline", user);
  }, [user]);

  const toggleSwitch = async () => {
    let status = "";
    if (user.status === "online") {
      status = "offline";
    } else {
      status = "online";
    }
    const id = user._id;
    const data = { id, status, token };
    const result = await dispatch(toggleStatusAsync(data));
    console.log(result)
    if (result.type === "/auth/toggleStatus/fulfilled") {
      setIsOn(!isOn);
    }
  };

  return (
    <>
      <div className="d-flex gap-3">
        <h6 className="p-1">{isOn ? "Online" : "Offline"}</h6>
        <Button
          color={isOn ? "success" : "secondary"}
          onClick={toggleSwitch}
          style={{
            width: "60px",
            height: "30px",
            borderRadius: "15px",
            display: "flex",
            justifyContent: isOn ? "flex-end" : "flex-start",
            padding: "2px",
          }}
        >
          <span
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              backgroundColor: "white",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)",
            }}
          />
        </Button>
      </div>
    </>
  );
};

export default OnOffButton;
