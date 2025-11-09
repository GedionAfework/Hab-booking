import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toaster = (props) => (
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop {...props} />
);
