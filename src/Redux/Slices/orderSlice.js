/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  activateOrder,
  cancelOrder,
  fetchCancOrders,
  fetchOrders,
  fetchSchOrders,
  changeToPast,
  fetchAllOrders,
  fetchActiveOrders,
} from "../../APIs/orders";

export const getAllTheOrders = createAsyncThunk(
  "orders/fetchAllOrdersforworker",
  async (id) => {
    const response = await fetchAllOrders(id);
    return response;
  }
);

export const fetchScheduledOrdersAsync = createAsyncThunk(
  "orders/fetchScheduledOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Scheduled" };
    const response = await fetchSchOrders(data);
    return response;
  }
);

export const fetchPastOrdersAsync = createAsyncThunk(
  "orders/fetchPastOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Past" };
    const response = await fetchOrders(data);
    return response;
  }
);

export const fetchCancelledOrdersAsync = createAsyncThunk(
  "orders/fetchCancelledOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Cancelled" };
    const response = await fetchCancOrders(data);
    return response;
  }
);

export const fetchActiveOrdersAsync = createAsyncThunk(
  "orders/fetchActiveOrders",
  async (token) => {
    console.log("Active orders ran ");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Active" };
    const response = await fetchActiveOrders(data);
    return response;
  }
);

export const cancelOrderAsync = createAsyncThunk(
  "orders/cancelOrders",
  async (dataWithToken) => {
    const response = await cancelOrder(dataWithToken);
    return response.updatedOrder.Status;
  }
);

export const activateOrderAsync = createAsyncThunk(
  "orders/activateOrders",
  async (data) => {
    const { orderId } = data;
    const response = await activateOrder(data);
    return response;
  }
);

export const changeStatusToPastAsync = createAsyncThunk(
  "orders/changeToPastOrders",
  async (data) => {
    console.log(data);
    const { orderId } = data;
    const response = await changeToPast(data);
    return response;
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState: {
    scheduledOrders: null,
    pastOrders: null,
    cancelledOrders: null,
    activeOrders: null,
    orderCancelledBool: null,
    orderActivated: false,
    data: null,
    error: null,
    status: null,
  },
  extraReducers: (builder) => {
    builder //the thunk that is called when the  sch are fetched
      .addCase(fetchScheduledOrdersAsync.pending, (state) => {
        state.scheduledOrders = { data: null, status: "loading" };
      }) //the thunk that is called when the  sch are fetched
      .addCase(fetchScheduledOrdersAsync.fulfilled, (state, action) => {
        state.scheduledOrders = action.payload;
        state.status = "succeeded";
      }) //the thunk that is called when the  sch are fetched
      .addCase(fetchScheduledOrdersAsync.rejected, (state, action) => {
        state.scheduledOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      }) //the thunk that is called when the  past are fetched
      .addCase(fetchPastOrdersAsync.pending, (state) => {
        state.pastOrders = { data: null, status: "loading" };
      }) //the thunk that is called when the  past are fetched
      .addCase(fetchPastOrdersAsync.fulfilled, (state, action) => {
        state.pastOrders = action.payload;
        state.status = "succeeded";
      }) //the thunk that is called when the  past are fetched
      .addCase(fetchPastOrdersAsync.rejected, (state, action) => {
        state.pastOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      }) //the thunk that is called when the  cancelled are fetched
      .addCase(fetchCancelledOrdersAsync.pending, (state) => {
        state.cancelledOrders = { data: null, status: "loading" };
      }) //the thunk that is called when the  cancelled are fetched
      .addCase(fetchCancelledOrdersAsync.fulfilled, (state, action) => {
        state.cancelledOrders = action.payload;
        state.status = "succeeded";
      }) //the thunk that is called when the cancelled are fetched
      .addCase(fetchCancelledOrdersAsync.rejected, (state, action) => {
        state.cancelledOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      }) //the thunk that is called when the status of the order is changed to cancel
      .addCase(cancelOrderAsync.pending, (state) => {
        state.orderCancelledBool = { data: null, status: "loading" };
      }) //the thunk that is called when the status of the order is changed to cancel
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.orderCancelledBool = {
          data: null,
          status: "rejected",
          error: action.error.message,
        };
      }) //the thunk that is called when the status of the order is changed to cancel
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.orderCancelledBool = action.payload;
      }) //the thunk that is called when the active orders are fetched
      .addCase(fetchActiveOrdersAsync.pending, (state) => {
        state.activeOrders = { data: null, status: "loading" };
      })
      .addCase(fetchActiveOrdersAsync.rejected, (state, action) => {
        state.activeOrders = {
          data: null,
          status: "rejected",
          error: action.error.message,
        };
      })
      .addCase(fetchActiveOrdersAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.activeOrders = action.payload;
      });
  },
});
export default orderSlice.reducer;
