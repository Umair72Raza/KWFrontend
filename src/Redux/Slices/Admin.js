import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewService,
  deleteAService,
  fetchFeedbacksofUser,
  getAllServicesAdmin,
  getAllTheUsers,
  getAllTheWorkers,
  getAllUserOrders,
  togglePersonAccess,
} from "../../APIs/Admin";

export const fetchUsersAsync = createAsyncThunk(
  "/admin/getUsers",
  async (token) => {
    try {
      //get users
      const response = await getAllTheUsers(token);
      //console.log(response,"response in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error getting users");
    }
  }
);

export const fetchWorkersAsync = createAsyncThunk(
  "/admin/getWorkers",
  async (token) => {
    try {
      //get workers
      const response = await getAllTheWorkers(token);
      //console.log(response, "response in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error getting workers");
    }
  }
);

export const togglePersonAccessAsync = createAsyncThunk(
  "/admin/toggleAccess",
  async (data) => {
    try {
      const { token, id, access } = data;
      const response = await togglePersonAccess(token, id, access);
      //console.log(response, "response toggle access in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error getting workers");
    }
  }
);

export const allServicesAsync = createAsyncThunk(
  "/admin/getallservices",
  async () => {
    try {
      const response = await getAllServicesAdmin();
      return response;
    } catch (error) {
      console.log(error, "error getting services");
    }
  }
);
export const addServiceAsync = createAsyncThunk(
  "/admin/addServices",
  async (data) => {
    try {
      const { token, name, id } = data;
      const response = await createNewService(token, name, id);
      //console.log(response, "response add services in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error adding service");
    }
  }
);

//deleteAService

export const deleteServiceAsync = createAsyncThunk(
  "/admin/deleteService",
  async (data) => {
    try {
      const { token, id } = data;
      const response = await deleteAService(token, id);
      //console.log(response, "response delete services in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error deleting service");
    }
  }
);

//get orders of a user.

export const ordersOfUserByUid = createAsyncThunk(
  "/admin/getOrdersofUsers",
  async (data) => {
    try {
      const { token, id } = data;
      const response = await getAllUserOrders(token, id);
      //console.log(response, "response get orders in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error getting orders");
    }
  }
);

export const fetchFeedbacksAsync = createAsyncThunk(
  "/admin/getFeedbacks",
  async (data) => {
    try {
      const response = await fetchFeedbacksofUser(data);
      //console.log(response, "response get feedbacks in the thunk");
      return response;
    } catch (error) {
      console.log(error, "error getting feedbacks");
    }
  }
);

const adminSlice = createSlice({
  name: "adminSlice",
  initialState: {
    Users: null,
    Workers: null,
    personAccess: null,
    services: null,
    newService: null,
    feedbacks:null,
    deletedPerson: null,
    ordersofAUser:null,
    data: null,
    error: null,
    status: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.Users = { data: null, status: "loading" };
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.Users = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.Users = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(fetchWorkersAsync.pending, (state) => {
        state.Workers = { data: null, status: "loading" };
      })
      .addCase(fetchWorkersAsync.fulfilled, (state, action) => {
        state.Workers = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchWorkersAsync.rejected, (state, action) => {
        state.Workers = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(togglePersonAccessAsync.pending, (state) => {
        state.personAccess = { data: null, status: "loading" };
      })
      .addCase(togglePersonAccessAsync.fulfilled, (state, action) => {
        state.personAccess = action.payload;
        state.status = "succeeded";
      })
      .addCase(togglePersonAccessAsync.rejected, (state, action) => {
        state.personAccess = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(allServicesAsync.pending, (state) => {
        state.services = { data: null, status: "loading" };
      })
      .addCase(allServicesAsync.fulfilled, (state, action) => {
        state.services = action.payload;
        state.status = "succeeded";
      })
      .addCase(allServicesAsync.rejected, (state, action) => {
        state.services = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(addServiceAsync.pending, (state) => {
        state.newService = { data: null, status: "loading" };
      })
      .addCase(addServiceAsync.fulfilled, (state, action) => {
        state.newService = action.payload;
        state.status = "succeeded";
      })
      .addCase(addServiceAsync.rejected, (state, action) => {
        state.newService = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(deleteServiceAsync.pending, (state) => {
        state.deletedPerson = { data: null, status: "loading" };
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.deletedPerson = action.payload;
        state.status = "succeeded";
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.deletedPerson = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(ordersOfUserByUid.pending, (state) => {
        state.ordersofAUser = { data: null, status: "loading" };
      })
      .addCase(ordersOfUserByUid.fulfilled, (state, action) => {
        state.ordersofAUser = action.payload;
        state.status = "succeeded";
      })
      .addCase(ordersOfUserByUid.rejected, (state, action) => {
        state.ordersofAUser = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(fetchFeedbacksAsync.pending, (state) => {
        state.feedbacks = { data: null, status: "loading" };
      })
      .addCase(fetchFeedbacksAsync.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchFeedbacksAsync.rejected, (state, action) => {
        state.feedbacks = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      });
  },
});
export default adminSlice.reducer;
