export const LoginPage = {
  TITLE: "Welcome to KaamWala App!",
  ROUTES: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/createAccount",
    WORKER_REGISTER: "/auth/workerRegister",
    FORGET_PASSWORD: "/auth/forgetPassword",
  },
  FORM_FIELDS: {
    EMAIL: "email",
    PASSWORD: "password",
  },
  LABELS: {
    EMAIL: "Email",
    PASSWORD: "Password",
    FORGET_PASSWORD: "Forgot Password?",
    WORKER_DESCRIPTION: "Want to offer services?",
    WORKER_DESCRIPTION2: "Register yourself!",
    LOGIN: "Log in",
    MEMBER: "Not a member?",
    ACCOUNT: "Create an account",
  },
  PLACEHOLDERS: {
    EMAIL: "Enter your email",
    PASSWORD: "Enter your password",
  },
  ERROR_MESSAGES: {
    invalidEmail: "Invalid email address",
  },
};

export const RegisterPage = {
  ROUTES: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/createAccount",
    WORKER_REGISTER: "/auth/workerRegister",
    // Add more routes as needed
  },
  FORM_FIELDS: {
    REQUIRED: "*",
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    EMAIL: "email",
    PHONE: "phoneNumber",
    PASSWORD: "password",
    CONFIRM_PASSWORD: "confirmPassword",
    ADDRESS: "address",
    SERVICES: "services",
  },
  LABELS: {
    USER_TITLE: "Create an account as a user",
    WORKER_TITLE: "Create an account as a worker",
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    EMAIL: "Email",
    PHONE: "Phone Number",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
    ADDRESS: "Address",
    SERVICES: "Services",
    REGISTER: "Register",
    MEMBER: "Already a member? ",
    ACCOUNT: "Login to your account",
    SIGNUP: "Sign up",
  },
  PLACEHOLDERS: {
    FIRST_NAME: "Enter your first name",
    LAST_NAME: "Enter your last name",
    EMAIL: "Enter your email",
    PHONE: "Enter your phone number",
    PASSWORD: "Enter your password",
    CONFIRM_PASSWORD: "Confirm your password",
    ADDRESS: "Enter your address",
    SERVICES: "Select a service",
  },
  SUCCESS_MESSAGES: {
    WORKER_SIGNUP:
      "Worker ID  is created successfully. Please login into your Account.",
    USER_SIGNUP:
      "User ID is created successfully. Please login into your Account.",
  },
  ERROR_MESSAGES: {
    invalidEmail: "Invalid email address.",
    emptyEmail: "Email cannot be empty",
    invalidPhoneNumber: "Please enter a valid phone number.",
    invalidPassword:
      "Password must contain at least one special character, one uppercase letter, one number, and atleast 8 characters long.",
    passwordsNotMatch: "Passwords do not match.",
    emptyPassword: "Password cannot be empty",
    enterAllFields: "Enter all the fields to sign up.",
    invalidRate: "Please set rate between $10 and $999 per hour",
    invalidAddress: "Address cannot be empty",
    invalidLastName: "Last Name cannot be empty",
    invalidFirstName: "First Name cannot be empty",
    invalidService: "Please select at least one service.",
    emptyPhone: "Phone number is required",
  },
  SUCCESS_MESSAGES: {
    CONFIRMPASSWORD: "Password Matched.",
    PASSWORD_VALID: "Password is valid.",
  },
  LOADER_MESSAGES: {
    SERVICES_LOADING: "Loading Services...",
    LIST_NOT_AVAILABLE: "No services listed by admin yet.",
  },
  TOOLTIPS: {
    ALL_FIELDS: "Enter all fields to sign up!",
  },
  FORM_GROUPS: {
    PERSONAL_INFO: "Personal Information",
    ACCOUNT_INFO: "Account Information",
  },
  INPUT_FIELDS: {
    FIRST_NAME: {
      type: "text",
      name: "firstName",
      placeholder: "Enter your first name",
    },
    LAST_NAME: {
      type: "text",
      name: "lastName",
      placeholder: "Enter your last name",
    },
    EMAIL: {
      name: "email",
      placeholder: "Enter your email",
    },
    PHONE: {
      type: "tel",
      name: "phoneNumber",
      placeholder: "Enter your phone number",
    },
    PASSWORD: {
      name: "password",
      placeholder: "Enter your password",
    },
    CONFIRM_PASSWORD: {
      name: "confirmPassword",
      placeholder: "Confirm your password",
    },
    ADDRESS: {
      name: "address",
      placeholder: "Enter your address",
    },
    SERVICES: {
      name: "services",
      type: "select",
      placeholder: "Select a service",
      rate: "($/hr)",
    },
  },
  SERVICES_INFO: {
    SERVICES_SELECTION_LIMIT: "You can select upto 5 services.",
  },
  SERVICES_MAPPING: [
    { name: "Plumber", label: "Plumber" },
    { name: "Electrician", label: "Electrician" },
    { name: "Carpenter", label: "Carpenter" },
    { name: "Painter", label: "Painter" },
    { name: "Maid", label: "Maid" },
    { name: "Gardener", label: "Gardener" },
    { name: "Cook", label: "Cook" },
    { name: "Laundry", label: "Laundry" },
    { name: "Driver", label: "Driver" },
    { name: "Security", label: "Security" },
    { name: "Other", label: "Other" },
  ],
};

export const ChatPopUpPage = {
  MESSAGE_TODAY: "Today",
  MESSAGE_YESTERDAY: "Yesterday",
  START_CONVERSATION: "Start a conversation",
  CHAT_TITLE: "Chats",
  BOOK_BUTTON_LABEL: "Book",
  BOOK_BUTTON_COLOR: "success",
  SEND_BUTTON_LABEL: "Send",
  SEND_BUTTON_COLOR: "primary",
  SELECT_CHAT_LABEL: "Select a chat to start messaging",
  BLOCKED_BY_ADMIN: "Blocked by Admin",
  NO_CHATS: "No Chats!",
};

export const HomePageWorkerConsts = {
  REASON_NOT_MENTIONED: "Reason not mentioned",
};

export const TABS = {
  SCHEDULED: "Scheduled",
  PAST: "Past",
  CANCELLED: "Cancelled",
  ACTIVE: "Active",
  SCH_ORDERS: "Scheduled Orders",
  NO_SCH_ORDERS: "No Scheduled Orders!",
  PAST_ORDERS: "Past Orders",
  NO_PAST_ORDERS: "No Past Orders!",
  CANCELLED_ORDERS: "Cancelled Orders",
  NO_CANC_ORDERS: "No Cancelled Orders",
  ACTIVE_ORDERS: "Active Orders",
  NO_ACTIVE_ORDERS: "No Active Orders!",
  Pending: "Pending Orders",
};

export const GOTOFFER = {
  OFFER_HEADER: "Do you want to Accept the Offer?",
  OFFER_TITLE: "Title: ",
  OFFER_DATE: "DATE: ",
  OFFER_TIME: "TIME: ",
  OFFER_AMOUNT: "Amount: ",
  OFFER_DETAILS: "Details: ",
  OFFER_SERVICE: "Service: ",
  ACCEPT_BUTTON: "Accept Offer!",
  REJECT_BUTTON: "Reject Offer!",
  SEE_DETAILS_BUTTON: "See Full Details",
  FULL_DETAILS: "Full Details",
  FULL_DETAILS_HEADING: "Full Details: ",
  CLOSE_BUTTON: "Close",
};

export const FORGET_PASSWORD = {
  SEND_OTP_BUTTON: "Send OTP",
  EG_MAIL: "",
};

export const EDITPROFILE_PAGE = {
  LABELS: {
    TITLE: "Your Profile",
  },
  BUTTONS: {
    EDIT: "Edit Profile",
    SAVE: "Save",
    CANCEL: "Cancel",
  },
  CARD_LABELS: {
    FIRST_NAME: "First Name:",
    LAST_NAME: "Last Name:",
    EMAIL: "Email:",
    PHONE: "Phone Number:",
    ADDRESS: "Address:",
    SERVICES: "Services:",
    RATE: "$/hr",
    COUNTRY: "Country:",
    CITY: "City:",
    REGION_STATE: "Region/State:",
    OPTIONAL: "Optional",
    NO_OPT_ADDRESS: "No optional address added.",
  },
  ROUTES: {
    BACK_USER: "/user/homepage",
    BACK_WORKER: "/worker/workerHomepage",
  },
};

export const HomePageUserConst = {
  button: {
    orders: "Orders",
    filters: "Filters",
  },
  heading: {
    filter: "Filters and Sort",
  },
};

export const BookingConstants = {
  button: {
    send: "Send",
    cancel: "Cancel",
  },

  heading: {
    book: "Book a Service",
  },

  div: {
    name: "Name: ",
    status: "Status: ",
    rating: "Rating: ",
  },
  Labels: {
    taskTitle: "Task Title",
    worker: "Worker Details",
    taskDetail: "Task Details",
    service: "Service Type",
    datetime: "Date and Time",
    images: "Upload Images",
    amount: "Amount Per Job ($)",
  },
};
export const feedbackConstants = {
  heading: {
    rateService: "Rate The Service",
    rateUser: "Rate The User",
  },
};
export const filterConstants = {
  button: {
    clear: "Clear Filters",
  },
  Labels: {
    sort1: "Sort by Rating:",
    sort2: "Sort by Distance:",
    filter: "Filter by Distance:",
    l5: "5 km",
    l10: "10 km",
    l15: "15 km",
    l20: "20 km",
    filter1: "Filter by Rate:",
    l6to10: "Less then Equal $10",
    l11to15: "Less then Equal $15",
    l16to20: "Less then Equal $20",
    g20: "Greater then    $20",
  },
  options: {
    none: "None",
    htlR: "High to Low Rating",
    lthR: "Low to High Rating",
    htld: "High to Low Distance",
    lthd: "Low to High Distance",
  },
};
export const navbarConstants = {
  NavBar: {
    brandName: "KaamWala",
  },
};
export const workerCardConstants = {
  WorkerCardText: {
    Services: "Services:",
  },
  WorkerCardButtons: {
    chat: "Chat",
    book: "Book",
  },
};
export const forgetPasswordConstants = {
  FP_FIELDS: {
    EMAIL: "Please Provide the Email Address.",
    MSG: "An OTP will be sent to your Email",
    EG_MAIL: "Enter your Email",
    FP_TOAST_MSG: "OTP Sent Successfully!",
  },
};

export const newpasswordConstants = {
  NP_CONSTANTS: {
    NP_HEADING: "Confirm your OTP.",
    ADD_NEW_PASS_HEADING: "Add New Password.",
    PROVIDE_OTP_LABEL: " Please Provide the OTP sent to you via Email!",
    NEWPASSWORD: "New Password",
    PASSWORD_PH: "Enter new password",
    CONFIRMPASSWORD: "Confirm Password",
    CONFIRMPASSWORD_PH: "Confirm new password",
    SAVEBUTTON: "Save New Password",
    VERIFYOTP: "VERIFY OTP",
  },
};

export const SERVICE_CONSTS = {
  SERVICES_HEADING: "Services",
  ADD_A_SERVICE: "Add a Service",
  ADD_NEW_SERVICE: "Add new service",
  NO_SERVICES: "No services available.",
  REMOVE: "Remove",
  UPDATE: "Update",
  CANCEL: "Cancel",
  EDIT: "Edit",
  BACK: "Back",
};

export const ADMIN_WORKERS = {
  WORKERS_HEADING: "Workers",
  BACK: "Back",
  ACTIVE_WORKERS: "Active Workers",
  INACTIVE_WORKERS: "Inactive Workers",
  NO_ACTIVE_WORKERS: "No Active Workers found",
  NO_INACTIVE_WORKERS: "No Inactive Workers found",
};

export const ADMIN_USERS = {
  USERS_HEADING: "Users",
  BACK: "Back",
  ACTIVE_USERS: "Active Users",
  INACTIVE_USERS: "Inactive Users",
  NO_ACTIVE_USERS: "No Active Users found",
  NO_INACTIVE_USERS: "No Inactive Users found",
};
