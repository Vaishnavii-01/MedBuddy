import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/MedBuddy_logo_.png";

const Navbar = ({ loggedIn }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signup");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleReminderClick = () => {
    navigate("/reminder");
  };

  const handlePharmacyClick = () => {
    navigate("/pharmacy");
  };

  const handleDoctorClick = () => {
    navigate("/doctor");
  };

  const handleHospitalClick = () => {
    navigate("/hospital");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-gradient-to-br from-blue-400 to-purple-600">
      <div>
        <img
          src={logo}
          alt="MedBuddy Logo"
          className="h-12 w-auto cursor-pointer"
          onClick={() => navigate("/")} // Navigate to home on logo click
        />
      </div>
      <div className="flex ml-auto items-center space-x-6">
        <ul className="flex space-x-6 text-white font-bold">
          <li className="cursor-pointer" onClick={handleReminderClick}>Reminder</li>
          <li className="cursor-pointer" onClick={handlePharmacyClick}>Pharmacy</li>
          <li className="cursor-pointer" onClick={handleDoctorClick}>Consultation</li>
          <li className="cursor-pointer" onClick={handleHospitalClick}>Hospital</li>
        </ul>
        <div>
          {!loggedIn ? (
            <button
              className="bg-yellow-500 text-black px-4 py-2 rounded-xl"
              onClick={handleLoginClick}
            >
              Login / Signup
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-xl"
                onClick={handleProfileClick}
              >
                Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
