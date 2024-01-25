// Create a file named StartJobContext.js
import React, { createContext, useContext, useReducer } from "react";

const StartJobContext = createContext();

const initialState = {
  isVisible: false,
  status: "", // "true" for success, "false" for failure
  orderId: null,
};

const startJobReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_START_JOB_RESULT":
      return {
        isVisible: true,
        status: action.status,
        orderId: action.orderId,
      };
    case "HIDE_START_JOB_RESULT":
      return initialState;
    default:
      return state;
  }
};

export const StartJobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(startJobReducer, initialState);

  const showStartJobResult = (status, orderId) => {
    dispatch({
      type: "SHOW_START_JOB_RESULT",
      status,
      orderId,
    });
    console.log("Show start job ran!")
  };

  const hideStartJobResult = () => {
    dispatch({
      type: "HIDE_START_JOB_RESULT",
    });
  };

  return (
    <StartJobContext.Provider
      value={{
        startJobResult: state,
        showStartJobResult,
        hideStartJobResult,
      }}
    >
      {children}
    </StartJobContext.Provider>
  );
};

export const useStartJob = () => useContext(StartJobContext);
