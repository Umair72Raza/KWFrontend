import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_BACKEND_ENDPOINT,
});

export const optSentAtSingUp = async (email) => {
  try {
    const response = await API.post(`user/otp_Sent`, { email: email });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const EmailVerification = async (email) => {
  try {
    const response = await API.put(`user/verifyEmail`, { email: email });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const sendOTP = async (email) => {
  try {
    const response = await API.post(`user/forgot-password`, { email: email });
   
    return response;
  } catch (error) {
  
    return error;
    //throw error.response.data;
  }
};

//sendOTPforEmail

export const sendOTPforEmail = async (data) => {
  try {
    const { mail, token, newMail,region_state } = data;
  
    const response = await API.put(
      `user/newMailOTP`,
      { email: mail, newMail: newMail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const sendOTPforPhone = async (data) => {
  try {
    const { mail, token, newPhone } = data;

    const response = await API.put(
      `user/newPhoneOTP`,
      { email: mail, newPhone: newPhone },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    return response;
  } catch (error) {
 
    return error.response.data;
    //throw error.response.data;
  }
};

export const newPasswordSetter = async (email, newPass) => {
  try {
    const response = await API.put(`user/newPassword`, {
      email: email,
      password: newPass,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const OTPverify = async (otp) => {
  try {
    const response = await API.put(`user/reset-password/${otp}`);

    return response;
  } catch (error) {
    throw error.response.data;
  }
};

//OTPverifyforEmail
export const OTPverifyforEmail = async (data) => {
  try {
    const { newMail, otp, token } = data;
    const response = await API.put(
      `user/new-email`,
      { newMail, otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error.response.data;
  }
};
export const OTPverifyforPhone = async (data) => {
  try {
    const { newPhone, otp, token } = data;
    const response = await API.put(
      `user/new-phone`,
      { newPhone, otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await API.post(`user/loginUser`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const updatePfp = async (email, profilePicture) => {
  try {
  
  
    const response = await API.put(
      "user/updatePfp",
      { email, profilePicture },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
   
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const signUpUser = async (
  firstName,
  lastName,
  email,
  password,
  profilePicture,
  phoneNumber,
  location,
  // longitude,
  // latitude,
  address,
  optionalAddress,
  country,
  region_state,
  city,
  services
) => {
  try {
    const response = await API.post(
      `user/signUp`,
      {
        firstName,
        lastName,
        email,
        password,
        profilePicture,
        phoneNumber,
        location,
        // longitude,
        // latitude,
        address,
        optionalAddress,
        country,
        region_state,
        city,
        services,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const toggleStatus = async (data) => {
  try {
    const { id, status } = data;
    const response = await API.put(
      `user/updateOnlineStatus/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
