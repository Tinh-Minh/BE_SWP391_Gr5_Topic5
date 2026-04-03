import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastProvider } from "./components/Toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";

const GOOGLE_CLIENT_ID = "396509870147-po4i83kippu4tcb4i7kg70j1l0oimson.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </GoogleOAuthProvider>
);