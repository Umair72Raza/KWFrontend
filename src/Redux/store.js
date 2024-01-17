import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/AuthSlice";
import OrderSlice from "./Slices/OrderSlice";
import ChatSlice from "./Slices/ChatSlice"
import HomepageSlice from "./Slices/HomepageSlice"
import BookingSlice from "./Slices/BookingSlice"
import FeedbackSlice from "./Slices/FeedBackSlice"
import AdminSlice from "./Slices/AdminSlice"
export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    order: OrderSlice,
    chat:ChatSlice,
    homepage:HomepageSlice,
    booking:BookingSlice,
    feedback:FeedbackSlice,
    admin: AdminSlice
  },
});
export default store;
