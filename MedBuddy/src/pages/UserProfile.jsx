import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";


const UserProfile = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  
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


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoggedIn(true);
       
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);


        if (userDocSnap.exists()) {
          setFormData(userDocSnap.data());
        } else {
          setFormData({ ...formData, email: currentUser.email });
        }
      } else {
        setLoggedIn(false);
        navigate("/login");
      }
      setLoading(false);
    });


    return () => unsubscribe();
  }, [setLoggedIn, navigate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleUpdate = async () => {
    if (!user) return alert("User not logged in!");


    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, formData, { merge: true });
    alert("Profile Updated Successfully!");
  };


  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
    navigate("/login");
  };


  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold">Loading...</div>;
  }


  return (
    <div className="bg-sky-200 py-5">
      <div className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>
       
        <form className="space-y-4">
          <input type="text" name="name" value={formData.name} placeholder="Name" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <input type="text" name="address" value={formData.address} placeholder="Address" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <div className="flex space-x-4">
            <input type="text" name="pincode" value={formData.pincode} placeholder="Pincode" className="border p-2 rounded-md w-1/2" onChange={handleChange} />
            <input type="text" name="age" value={formData.age} placeholder="Age" className="border p-2 rounded-md w-1/2" onChange={handleChange} />
          </div>
          <input type="email" name="email" value={formData.email} placeholder="Email" className="border p-2 rounded-md w-full" onChange={handleChange} disabled />
          <input type="text" name="contact" value={formData.contact} placeholder="Contact Number" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <input type="text" name="guardianName" value={formData.guardianName} placeholder="Guardian Name" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <input type="email" name="guardianEmail" value={formData.guardianEmail} placeholder="Guardian Email" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <input type="text" name="guardianContact" value={formData.guardianContact} placeholder="Guardian Contact Number" className="border p-2 rounded-md w-full" onChange={handleChange} />
          <textarea name="medicalBackground" value={formData.medicalBackground} placeholder="Medical Background" className="border p-2 rounded-md w-full" onChange={handleChange}></textarea>
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
    </div>  
  );
};


export default UserProfile;
