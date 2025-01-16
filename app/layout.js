"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { store } from "@/app/store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ToastContainer />
          {children}
        </Provider>
      </body>
    </html>
  );
}
