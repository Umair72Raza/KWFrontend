import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsersData } from "../../APIs/editProfile";

export const fetchUsersDataAsync = createAsyncThunk(
    "/userData",
    async (credentials) => {
      try {
        const {id,token} = credentials; 
        const response = await getUsersData(id,token);
        console.log(response,"response in the userslice");
        return response;
      } catch (error) {
        console.log(error, "error getting userData");
      }
    }
  );


  const EditProfileSlice = createSlice({
    name: "userSlice",
    initialState: {
      UsersData: null,
      data: null,
      error: null,
      status: null,
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsersDataAsync.pending, (state) => {
          state.Users = { data: null, status: "loading" };
        })
        .addCase(fetchUsersDataAsync.fulfilled, (state, action) => {
          state.UsersData = action.payload;
          state.status = "succeeded";
        })
        .addCase(fetchUsersDataAsync.rejected, (state, action) => {
          state.UsersData = {
            data: null,
            status: "failed",
            error: action.error.message,
          };
        })
    }
});

export default EditProfileSlice.reducer;