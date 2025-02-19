import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";
import PastShapes from "./PastShapes";
import "./styles.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/pastshapes" element={<PastShapes />} />


    </Routes>
  </Router>,
  rootElement
);