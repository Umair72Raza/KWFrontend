import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllWorkers, getWorkersByType } from "../../APIs/homepage";

export const getAllWorker = createAsyncThunk("homepage", async (data) => {
  const response = await getAllWorkers(data);
  return response;
});

export const WorkersByType = createAsyncThunk("homepage/workerbytype", async (params) => {
  const response = await getWorkersByType(params);
  return response;
});

const homepageSlice = createSlice({
  name: "homepage",
  initialState: {
    workers: null,
    Status: "idle",
    error: null,
  },
  reducers: {
    updateWorkers: (state, action) => {
      state.workers = action.payload;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllWorker.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(getAllWorker.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.workers = action.payload
      })
      .addCase(getAllWorker.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.error.message;
      })
      .addCase(WorkersByType.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(WorkersByType.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.workers = action.payload;
      })
      .addCase(WorkersByType.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.error.message;
      })
  }
});
export const { updateWorkers } = homepageSlice.actions;
export default homepageSlice.reducer;
