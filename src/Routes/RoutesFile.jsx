import React from "react";
import { Routes, Route } from "react-router-dom";
import IncomeDashboard from "../Income/IncomeDashboard";
import ExpenseDashboard from "../Expense/ExpenseDashboard";
import Layout from "../Components/Layout/Layout";
import Login from "../Components/Login/Login";
import RegistrationForm from "../Components/RegistrationForm";

export default function RoutesFile() {
  const user = localStorage.getItem("userId") || "";
  return (

    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/income" element={user && <IncomeDashboard />} />
      <Route path="/expense" element={user && <ExpenseDashboard />} />
      <Route path="/layout" element={user && <Layout />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
