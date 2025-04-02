import React from "react";
import heroImage from "/src/assets/homepgimg.svg";


const Home = () => {
  return (
      <div className="p-6 text-center bg-sky-200 min-h-screen text-pink-500">
        {/* Flexbox container with row layout */}
        <div className="flex items-center mt-5">
          {/* Left Side - Image */}
          <div className="flex flex-col items-start ml-10">
            <img
              src={heroImage}
              alt="MedBuddy Hero"
              className="w-full max-w-xl rounded-lg shadow-lg"
            />
            {/* Funky text below the image */}
            <p
              className="mt-4 ml-11 text-5xl font-extrabold"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                lineHeight: "1.4", // Adjusted line-height for spacing
              }}
            >
              WORRIED ABOUT <br />FORGETTING <br />
              YOUR MEDS?
            </p>
          </div>
  
          {/* Right Side - Text */}
          <div className="ml-60 text-left">
            <h2 className="ml-8 text-6xl font-bold text-pink-600">MedBuddy</h2>
            <p className="mt-4 ml-12 text-3xl">
              is here to help
            </p>
            <p className="mt-2 ml-6 text-3xl">
              Your all-in-one health platform..
            </p>
          </div>
        </div>
      </div>
    );
};

export default Home;
