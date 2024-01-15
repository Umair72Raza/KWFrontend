export const LoginPage = {
  ROUTES: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    WORKER_REGISTER: "/auth/workerregister",
  },
  FORM_FIELDS: {
    EMAIL: "email",
    PASSWORD: "password",
  },
  LABELS: {
    EMAIL: "Email",
    PASSWORD: "Password",
    WORKER_DESCRIPTION: "Want to offer services?",
    WORKER_DESCRIPTION2: "Register yourself!",
    LOGIN: "Login",
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
    REGISTER: "/auth/register",
    WORKER_REGISTER: "/auth/workerregister",
    // Add more routes as needed
  },
  FORM_FIELDS: {
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
        TITLE:"Register",
        FIRST_NAME: "First Name",
        LAST_NAME: "Last Name",
        EMAIL: "Email",
        PHONE: "Phone Number",
        PASSWORD: "Password",
        CONFIRM_PASSWORD: "Confirm Password",
        ADDRESS: "Address",
        SERVICES: "Services",
        REGISTER: "Register",
        MEMBER: "Already a member?",
        ACCOUNT: "Login to your account",
        SIGNUP:"Signup",
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
    ERROR_MESSAGES: {
        invalidEmail: "Invalid email address",
        invalidPhoneNumber: "Please enter a valid phone number",
        invalidPassword:
            "Password must contain at least one special character, one uppercase letter, one number, and be at least 8 characters long.",
        passwordsNotMatch: "Passwords do not match",
        enterAllFields: "Enter all the fields to sign up",
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
        },
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


