import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white">
      <div className="text-xl font-bold text-blue-600">MedBuddy</div>

      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li className="cursor-pointer">Home</li>
        <li className="cursor-pointer">Services</li>
        <li className="cursor-pointer">About</li>
        <li className="cursor-pointer">Contact</li>
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
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
            onClick={handleLogout}
          >
            Profile
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
