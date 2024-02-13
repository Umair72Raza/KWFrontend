import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  activateOrder,
  cancelOrder,
  fetchCancOrders, 
  fetchSchOrders,
  changeToPast,
  fetchAllOrders,
  fetchActiveOrders,
  fetchPendingOrders,
  fetchOpenOrders,
  fetchPostedOrders,
  deleteTheOrder,
  fetchPastOrders,
  schedulizeOrder,
  checkStatus,
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
    const response = await fetchPastOrders(data);
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
export const fetchPostedOrdersAsync = createAsyncThunk(
  "orders/fetchPostedOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Posted" };
    const response = await fetchPostedOrders(data);
    return response;
  }
);
export const fetchPendingOrdersAsync = createAsyncThunk(
  "orders/fetchPendingOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, users: userId, status: "Pending" };
    const response = await fetchPendingOrders(data);
    return response;
  }
);

export const fetchOpenOrdersAsync = createAsyncThunk(
  "orders/fetchOpenOrders",
  async (token) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    const data = { token: token, userId: userId };
    const response = await fetchOpenOrders(data);
   
    return response;
  }
);

export const fetchActiveOrdersAsync = createAsyncThunk(
  "orders/fetchActiveOrders",
  async (token) => {
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
    const response = await activateOrder(data);
    return response;
  }
);

export const schedulizeOrderAsync = createAsyncThunk(
  "orders/schedulizeOrder",
  async (data) => {
    const response = await schedulizeOrder(data);
    return response;
  }
);

export const changeStatusToPastAsync = createAsyncThunk(
  "orders/changeToPastOrders",
  async (data) => {
    const response = await changeToPast(data);
    return response;
  }
);

export const deleteTheOrderAsync = createAsyncThunk(
  "orders/deleteOrder",
  async (data) => {
    const response = await deleteTheOrder(data);
    return response;
  }
);

export const checkTheStatusAsync = createAsyncThunk(
  "orders/checkStatus",
  async (data, {rejectWithValue}) => {
    try {
      const response = await checkStatus(data);
  
      return response;
    } catch (error) {
      if (error) {
       
        return rejectWithValue(error.message);
      }
    }
  
  }
);

const orderSlice = createSlice({
  name: "orderSlice",
  initialState: {
    scheduledOrders: null,
    pastOrders: null,
    cancelledOrders: null,
    activeOrders: null,
    pendingOrders: null,
    orderCancelledBool: null,
    orderActivated: false,
    openOrders: null,
    deletedOrder: null,
    schedulizedOrder: null,
    data: null,
    error: null,
    status: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledOrdersAsync.pending, (state) => {
        state.scheduledOrders = { data: null, status: "loading" };
      })
      .addCase(fetchScheduledOrdersAsync.fulfilled, (state, action) => {
        state.scheduledOrders = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchScheduledOrdersAsync.rejected, (state, action) => {
        state.scheduledOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(schedulizeOrderAsync.pending, (state) => {
        state.schedulizedOrder = { data: null, status: "loading" };
      })
      .addCase(schedulizeOrderAsync.fulfilled, (state, action) => {
        state.schedulizedOrder = action.payload;
        state.status = "succeeded";
      })
      .addCase(schedulizeOrderAsync.rejected, (state, action) => {
        state.schedulizedOrder = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(fetchPastOrdersAsync.pending, (state) => {
        state.pastOrders = { data: null, status: "loading" };
      })
      .addCase(fetchPastOrdersAsync.fulfilled, (state, action) => {
        state.pastOrders = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPastOrdersAsync.rejected, (state, action) => {
        state.pastOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(fetchCancelledOrdersAsync.pending, (state) => {
        state.cancelledOrders = { data: null, status: "loading" };
      })
      .addCase(fetchCancelledOrdersAsync.fulfilled, (state, action) => {
        state.cancelledOrders = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCancelledOrdersAsync.rejected, (state, action) => {
        state.cancelledOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })

      .addCase(fetchPendingOrdersAsync.pending, (state) => {
        state.pendingOrders = { data: null, status: "loading" };
      })
      .addCase(fetchPendingOrdersAsync.fulfilled, (state, action) => {
        state.pendingOrders = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPendingOrdersAsync.rejected, (state, action) => {
        state.pendingOrders = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(cancelOrderAsync.pending, (state) => {
        state.orderCancelledBool = { data: null, status: "loading" };
      })
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.orderCancelledBool = {
          data: null,
          status: "rejected",
          error: action.error.message,
        };
      })
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.orderCancelledBool = action.payload;
      })
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
      })
      .addCase(fetchOpenOrdersAsync.pending, (state) => {
        state.openOrders = { data: null, status: "loading" };
      })
      .addCase(fetchOpenOrdersAsync.rejected, (state, action) => {
        state.openOrders = {
          data: null,
          status: "rejected",
          error: action.error.message,
        };
      })
      .addCase(fetchOpenOrdersAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.openOrders = action.payload;
      })
      .addCase(deleteTheOrderAsync.pending, (state) => {
        state.deletedOrder = null;
      })
      .addCase(deleteTheOrderAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.deletedOrder = action.payload;
      })
      .addCase(deleteTheOrderAsync.rejected, (state) => {
        state.deletedOrder = null
      });
  },
});
export default orderSlice.reducer;
