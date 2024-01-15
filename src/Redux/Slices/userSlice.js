import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  OTPverify,
  loginUser,
  newPasswordSetter,
  sendOTP,
  signUpUser,
  toggleStatus,
} from "../../APIs/auth";
import { Logout, failureToast } from "../../utils";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    const { email, password } = credentials;
    const response = await loginUser(email, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    const result = response;
    return result;
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  Logout();
});

export const signUpUserAsync = createAsyncThunk(
  "auth/signup",
  async (credentials) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      longitude,
      latitude,
      address,
      services,
    } = credentials;
    const response = await signUpUser(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      longitude,
      latitude,
      address,
      services
    );
return response.data;
  }
);


export const requestOTPAsync = createAsyncThunk(
  "auth/requestOTP",
  async (email) => {
    try {
      console.log(email);
      const response = await sendOTP(email);
      console.log(response.status, "response from request OTP");
      return response.data;
    } catch (error) {
      console.log(error);
      failureToast("Couldn't send OTP");
    }
  }
);

export const requestOTPverification = createAsyncThunk(
  "auth/otpverify",
  async (otp) => {
    try {
      console.log(otp);
      const response = await OTPverify(otp);
      console.log(response.status);
      return response.status;
    } catch (error) {
      console.log(error);
      failureToast("Inavlid OTP");
    }
  }
);

export const setNewPassAsync = createAsyncThunk(
  "auth/setnewpass",
  async (data) => {
    try {
      const { email, newPassword } = data;
      const password = newPassword;
      const response = await newPasswordSetter(email, password);
      console.log(response.status, "response of newpassword set");
      if (response.status === 200) {
        return response.status;
      } else {
        return response;
      }
    } catch (error) {
      failureToast("Couldn't save new Password");
    }
  }
);


export const toggleStatusAsync = createAsyncThunk(
  "/auth/toggleStatus",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data)
      const response = await toggleStatus(data);
      console.log(response.updatedStatus,'resp.datat in the slice')
      localStorage.setItem("user", JSON.stringify(response.updatedStatus));
      return response; // Assuming your relevant data is in response.data
    } catch (error) {
      // You can handle errors here, e.g., show a toast message
      failureToast("Couldn't change the status");
      return rejectWithValue(error.response.data);
    }
  }
);
const authSlice = createSlice({
  name: "login",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("token"),
    loginStatus: "idle",
    signupStatus: "idle",
    signupWorkerStatus: "idle",
    otp: null,
    otpStatus: "idle",
    otpError: "null",
    error: null,
    resetOtp: null,
    resetStatus: "idle",
    resetError: "idle",
    newPasswordStatus: "idle",
    newpass: null,
    newStatus: null,
  },
  reducers: {
    updateOtpStatus: (state, action) => {
      state.otpStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(signUpUserAsync.pending, (state) => {
        state.signupStatus = "loading";
      })
      .addCase(signUpUserAsync.fulfilled, (state) => {
        state.signupStatus = "succeeded";
        // Handle signup success data if needed
      })
      .addCase(signUpUserAsync.rejected, (state, action) => {
        state.signupStatus = "failed";
        state.error = action.error.message;
      })
      .addCase(requestOTPAsync.pending, (state) => {
        state.otpStatus = "loading";
      })
      .addCase(requestOTPAsync.rejected, (state, action) => {
        state.otpStatus = "failed";
        state.otpError = action.error.message;
      })
      .addCase(requestOTPAsync.fulfilled, (state, action) => {
        state.otpStatus = "suceeded";
        state.otp = action.payload;
      })
      .addCase(requestOTPverification.fulfilled, (state, action) => {
        state.resetStatus = "suceeded";
        state.resetOtp = action.payload;
      })
      .addCase(requestOTPverification.pending, (state) => {
        state.resetStatus = "loading";
      })
      .addCase(requestOTPverification.rejected, (state, action) => {
        state.resetStatus = "failed";
        state.resetError = action.error.message;
      })
      .addCase(setNewPassAsync.fulfilled, (state, action) => {
        state.newPasswordStatus = "suceeded";
        state.newpass = action.payload;
      })
      .addCase(setNewPassAsync.rejected, (state, action) => {
        state.newPasswordStatus = "failed";
        state.newpass = action.error.message;
      })
      .addCase(setNewPassAsync.pending, (state) => {
        state.newPasswordStatus = "loading";
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loginStatus = "failed";
        // state.username = null;
      })
      .addCase(toggleStatusAsync.fulfilled, (state,action) => {
        state.newStatus= action.payload
      });
  },
});
export const { updateOtpStatus } = authSlice.actions;
export default authSlice.reducer;
