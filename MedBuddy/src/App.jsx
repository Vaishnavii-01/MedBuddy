import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import the Footer component
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import Reminder from "./pages/Reminder"; // Import the Reminder page
import Pharmacy from "./pages/Pharmacy"; // Import the Pharmacy page
import Doctor from "./pages/Doctor"; // Import the Doctor page
import Hospital from "./pages/Hospital"; // Import the Hospital page

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar loggedIn={loggedIn} />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile"
            element={<UserProfile setLoggedIn={setLoggedIn} />}
          />
          <Route path="/reminder" element={<Reminder />} /> {/* New Route */}
          <Route path="/pharmacy" element={<Pharmacy />} /> {/* New Route */}
          <Route path="/doctor" element={<Doctor />} /> {/* New Route */}
          <Route path="/hospital" element={<Hospital />} /> {/* New Route */}
        </Routes>
      </div>
      <Footer /> {/* Footer is always present at the bottom */}
    </div>
  );
};

export default App;
