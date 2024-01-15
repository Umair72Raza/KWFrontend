import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/userSlice";
import orderReducer from "./Slices/orderSlice";
import ChatReducer from "./Slices/ChatSlice"
import homepageSlice from "./Slices/homepageSlice"
import bookingSlice from "./Slices/bookingSlice"
import feedbackSlice from "./Slices/feedBackSlice"
import adminSlice from "./Slices/Admin"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
    chat:ChatReducer,
    homepage:homepageSlice,
    booking:bookingSlice,
    feedback:feedbackSlice,
    admin: adminSlice
  },
});
export default store;
