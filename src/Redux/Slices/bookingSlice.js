import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder } from "../../APIs/booking";

export const CreateOrder = createAsyncThunk("booking", async (data) => {
  const response = await createOrder(data);
  return response.newOrder;
});

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    newOrder: null,
    data: null,
    Status: "idle",
    error: null,

  },
  reducers: {
    setnewOrderValue:(state,action)=>{
      state.newOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateOrder.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(CreateOrder.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.newOrder = action.payload
        console.log(action.payload)
      })
      .addCase(CreateOrder.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.error.message;
      })
  }

});
export const { setnewOrderValue } = bookingSlice.actions;
export default bookingSlice.reducer;
