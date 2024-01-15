import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {store} from "./Redux/store.js"
import { Provider } from 'react-redux';
import ChatProvider from './Context/ChatProvider.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChatProvider >
  <Provider store={store}>
 <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
  </Provider>
  </ChatProvider>
);
