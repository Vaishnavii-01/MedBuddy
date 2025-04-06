import React from "react";
import heroImage from "/src/assets/homepgimg.svg";
import { useNavigate } from "react-router-dom"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate(); 

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);


  const handleGetStarted = () => {
    navigate("/signup"); 
  };

  return (
    <div className="p-6 text-center bg-sky-200 min-h-screen text-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_70%)] animate-pulse-slow"></div>

      <div className="flex items-center justify-between mt-10 relative z-10">

        <div className="flex flex-col items-start ml-20 animate-fade-in">
          <img
            src={heroImage}
            alt="MedBuddy Hero"
            className="w-full max-w-xl rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
          />

          <p
            className="mt-6 ml-11 text-5xl font-extrabold text-shadow"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              lineHeight: "1.4",
              animation: "bounce 2s infinite",
            }}
          >
            WORRIED ABOUT <br />FORGETTING <br />YOUR MEDS?
          </p>
        </div>

        <div className="ml-10 text-left animate-slide-in">
          <h2 className="ml-4 text-6xl font-bold text-pink-600">MedBuddy</h2>
          <p className="mt-4 ml-4 text-3xl">is here to help</p>
          <p className="mt-2 ml-4 text-3xl">Your all-in-one health platform..</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-semibold">Personalized Medicine Reminders</h4>
              <p className="mt-2 text-gray-700">Never miss a dose with tailored alerts.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-semibold">24/7 Doctor Consultations</h4>
              <p className="mt-2 text-gray-700">Connect with experts anytime, anywhere.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-semibold">Fast Pharmacy Delivery</h4>
              <p className="mt-2 text-gray-700">Get your medicines delivered quickly.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h4 className="text-xl font-semibold">Health Tracking Tools</h4>
              <p className="mt-2 text-gray-700">Monitor your health with easy tools.</p>
            </div>
          </div>
          {!userLoggedIn && (
          <div className="mt-6 text-center">
            <button
              className="bg-yellow-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition transform hover:-translate-y-1"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        )}
        </div>
      </div>

      <div className="mt-16 px-10 relative z-10">

        <div className="mt-12">
          <h3 className="text-4xl font-bold text-pink-600 mb-6">What Users Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 italic">"MedBuddy saved me from forgetting my meds! Amazing service!"</p>
              <p className="mt-2 text-right font-semibold">- Sarah K.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-gray-700 italic">"Quick consultations and fast delivery. Highly recommend!"</p>
              <p className="mt-2 text-right font-semibold">- John D.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slide-in {
    from { transform: translateX(50px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse-slow {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .animate-fade-in { animation: fade-in 1s ease-in-out; }
  .animate-slide-in { animation: slide-in 1s ease-in-out; }
  .text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); }
  .animate-pulse-slow { animation: pulse-slow 6s infinite; }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Home;