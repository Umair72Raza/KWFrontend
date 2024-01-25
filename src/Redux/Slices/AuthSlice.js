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
  async (credentials, { rejectWithValue }) => {
    try {
      const { email, password } = credentials;
      const response = await loginUser(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      const result = response;
      return result;
    } catch (error) {
      if (error) {
        return rejectWithValue(error.error);
      }
    }

  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  Logout();

});

export const signUpUserAsync = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        longitude,
        latitude,
        address,
        country,
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
        country,
        services
      );
      console.log(response)
      return response.data;
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


export const requestOTPAsync = createAsyncThunk(
  "auth/requestOTPAsync",
  async (email) => {
    try {
      console.log(email, "email in async")
      const response = await sendOTP(email);
      // console.log(response,"send otp resp")
      // return response;


      const serializableResponse = {
        data: response.data,
        status: response.status,
        // other serializable properties
      };
      return serializableResponse;
    } catch (error) {
      failureToast("Couldn't send OTP");
    }
  }
);

export const requestOTPverification = createAsyncThunk(
  "auth/otpverify",
  async (otp) => {
    try {
      const response = await OTPverify(otp);
      console.log("otp cerify response", response)
      return response.status;
    } catch (error) {
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
      console.log(response,"response in async")
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
      const response = await toggleStatus(data);
      const user = JSON.parse(localStorage.getItem('user'));
      user.status = response.updatedStatus.status;
      localStorage.setItem('user', JSON.stringify(user));
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
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
        }
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
        state.otpStatus = "succeeded";
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

      })
      .addCase(toggleStatusAsync.fulfilled, (state, action) => {
        state.user = action.payload.updatedStatus;
      });
  },
});
export const { updateOtpStatus } = authSlice.actions;
export default authSlice.reducer;
