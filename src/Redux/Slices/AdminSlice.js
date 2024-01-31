import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createNewService,
  deleteAService,
  editNewService,
  fetchFeedbacksofUser,
  fetchSettings,
  getAllServicesAdmin,
  getAllTheUsers,
  getAllTheWorkers,
  getAllUserOrders,
  togglePersonAccess,
  updateSettings,
} from "../../APIs/Admin";

export const fetchUsersAsync = createAsyncThunk(
  "/admin/getUsers",
  async (token) => {
    try {
      //get users
      const response = await getAllTheUsers(token);
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
      const { token, id, serviceName } = data;
      const response = await deleteAService(token,id, serviceName);
      return response;
    } catch (error) {
      console.log(error, "error deleting service");
    }
  }
);

export const updateServiceAsync = createAsyncThunk(
  "/admin/updateService",
  async (data) => {
    try {
      const { token, name, id } = data;
      const response = await editNewService(token, name, id);
      return response;
    } catch (error) {
      console.log(error, "error editing service");
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
      return response;
    } catch (error) {
      console.log(error, "error getting feedbacks");
    }
  }
);

export const getSettings = createAsyncThunk(
  "/admin/getSettings",
  async (data) => {
    try {
      const response = await fetchSettings(data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateSettingsAsync = createAsyncThunk(
  "/admin/updateSettings",
  async (data) => {
    try {
      const response = await updateSettings(data);
      return response;
    } catch (error) {
      console.log(error);
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
    updatedService: null,
    feedbacks: null,
    deletedPerson: null,
    ordersofAUser: null,
    data: null,
    error: null,
    status: null,
    settings: null,
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
      })
      .addCase(updateServiceAsync.pending, (state) => {
        state.updatedService = { data: null, status: "loading" };
      })
      .addCase(updateServiceAsync.fulfilled, (state, action) => {
        state.updatedService = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateServiceAsync.rejected, (state, action) => {
        state.updatedService = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      })
      .addCase(getSettings.pending, (state) => {
        state.settings = { data: null, status: "loading" };
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = "succeeded";
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.settings = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      });
  },
});
export default adminSlice.reducer;
