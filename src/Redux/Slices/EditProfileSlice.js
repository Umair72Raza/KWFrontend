import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsersData, updateProfile } from "../../APIs/editProfile";
import { updatePfp } from "../../APIs/auth";
import { updateUser } from "./AuthSlice";

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
  async (credentials, { rejectWithValue }) => {
    try {
      const { id, token, formData } = credentials;
      const response = await updateProfile(id, token, formData);
      // const user = JSON.parse(localStorage.getItem("user"));
      // user.firstName = response.data;
      localStorage.setItem("user", JSON.stringify(response));
  
      
      return response;
    } catch (error) {
      if (
        error.error.code === 11000 &&
        error.error.keyPattern &&
        error.error.keyPattern.email === 1
      ) {
        // Duplicate email error
        return rejectWithValue(
          "Email is already in use. Please choose a different email."
        );
      } else if (
        error.error.code === 11000 &&
        error.error.keyPattern &&
        error.error.keyPattern.phoneNumber === 1
      ) {
        // Duplicate email error
        return rejectWithValue(
          "Phone Number is already in use. Please choose a different phone number."
        );
      }
    }
  }
);
export const updatePfpAsync = createAsyncThunk(
  "/setnewpfp",
  async (data, { rejectWithValue }) => {
    try {
     
      const { email, profilePicture } = data;
      const result = await updatePfp(email, profilePicture);
      return result;
    } catch (error) {
      if (error) {
        return rejectWithValue("Error Occured!");
      }
      console.log(error);
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
      .addCase(updatePfpAsync.pending, (state) => {
        state.Users = { data: null, status: "loading" };
      })
      .addCase(updatePfpAsync.fulfilled, (state, action) => {
        state.UsersData = action.payload.user;
        state.status = "succeeded";
      })
      .addCase(updatePfpAsync.rejected, (state, action) => {
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
        state.error = action.error.message;
      });
  },
});

export default EditProfileSlice.reducer;
