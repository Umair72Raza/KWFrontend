import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AddFeedback } from "../../APIs/feedback";

export const AddFeedBack = createAsyncThunk("feedback", async (data) => {
  const response = await AddFeedback(data);
  return response;
});

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    data: null,
    Status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AddFeedBack.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(AddFeedBack.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.data = action.payload
        console.log(action.payload,"action.payload of adding feedback")
      })
      .addCase(AddFeedBack.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.error.message;
      })
  }
});

export default feedbackSlice.reducer;
