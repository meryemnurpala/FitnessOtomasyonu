import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; 
import Register from "./pages/Register";
import Login from "./pages/Login"; // Login bileşenini pages/Login'dan import ediyoruz
import Appointment from "./pages/Appointment";
import Appointments from "./pages/Appointments";
import BMI from "./pages/BMI";
import TrainingPrograms from "./pages/TrainingPrograms";
import Pricing from "./pages/Pricing";
import Dashboard from "./components/Dashboard"; // Dashboard bileşenini import ediyoruz
import Admin from "./pages/Admin";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> {/* Login sayfası yönlendirmesi */}
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/training-programs" element={<TrainingPrograms />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard sayfası yönlendirmesi */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
