import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/MedBuddy_logo.png"; 

const Navbar = ({ loggedIn }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signup");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-yellow-300">
      <button onClick={handleLogoClick} className="focus:outline-none">
        <img src={logo} alt="MedBuddy Logo" className="h-12 w-auto cursor-pointer" />
      </button>
      <div className="flex ml-auto items-center space-x-6">
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="cursor-pointer">Reminder</li>
          <li className="cursor-pointer">Pharmacy</li>
          <li className="cursor-pointer">Doctor</li>
          <li className="cursor-pointer">Hospital</li>
        </ul>
        <div>
          {!loggedIn ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
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
