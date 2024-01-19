import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsersData, updateProfile } from "../../APIs/editProfile";

export const fetchUsersDataAsync = createAsyncThunk(
  "/userData",
  async (credentials) => {
    try {
      const { id, token } = credentials;
      const response = await getUsersData(id, token);
      return response;
    } catch (error) {
      console.log(error, "error getting userData");
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  "/UpdateProfile",
  async (credentials) => {
    try {
      const { id, token, formData } = credentials;
      const response = await updateProfile(id, token, formData);
      return response;
    } catch (error) {
      console.log(error, "error in updating the profile");
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
      .addCase(updateProfileAsync.pending, (state) => {
        state.Users = { data: null, status: "loading" };
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.UsersData = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.UsersData = {
          data: null,
          status: "failed",
          error: action.error.message,
        };
      });
  },
});

export default EditProfileSlice.reducer;
