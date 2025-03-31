import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    pincode: "",
    age: "",
    email: "",
    contact: "",
    guardianName: "",
    guardianEmail: "",
    guardianContact: "",
    medicalBackground: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    console.log("Profile Updated", formData);
    // Implement update logic here
  };

  const handleLogout = () => {
    setLoggedIn(false);  // Log out by setting loggedIn to false
    navigate("/");        // Redirect to home or login page
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>
      
      <form className="space-y-4">
        <input type="text" name="name" placeholder="Name" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <div className="flex space-x-4">
          <input type="text" name="pincode" placeholder="Pincode" className="border p-2 rounded-md w-1/2" onChange={handleChange} />
          <input type="text" name="age" placeholder="Age" className="border p-2 rounded-md w-1/2" onChange={handleChange} />
        </div>
        <input type="email" name="email" placeholder="Email" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <input type="text" name="contact" placeholder="Contact Number" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <input type="text" name="guardianName" placeholder="Guardian Name" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <input type="email" name="guardianEmail" placeholder="Guardian Email" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <input type="text" name="guardianContact" placeholder="Guardian Contact Number" className="border p-2 rounded-md w-full" onChange={handleChange} />
        <textarea name="medicalBackground" placeholder="Medical Background" className="border p-2 rounded-md w-full" onChange={handleChange}></textarea>
      </form>

      <div className="text-center mt-6 space-x-4">
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
          Update Profile
        </button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
