import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, editOrder } from "../../APIs/booking";

export const CreateOrder = createAsyncThunk("booking", async (data) => {
  const { formData, token } = data;
  console.log(data, "from booking slice ");
  const response = await createOrder(formData, token);
  return response.newOrder;
});
export const editOrderAsync = createAsyncThunk("editing", async (data) => {
  const { formData, token, id } = data;
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  console.log(formDataObject, "formData in thunk");
  console.log(data, "from booking slice ");
  const response = await editOrder(formData, token, id);
  return response.updatedOrder;
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
    setnewOrderValue: (state, action) => {
      state.newOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateOrder.pending, (state) => {
        state.Status = "loading";
      })
      .addCase(CreateOrder.fulfilled, (state, action) => {
        state.Status = "succeeded";
        state.newOrder = action.payload;
      })
      .addCase(CreateOrder.rejected, (state, action) => {
        state.Status = "failed";
        state.error = action.error.message;
      });
  },
});
export const { setnewOrderValue } = bookingSlice.actions;
export default bookingSlice.reducer;
