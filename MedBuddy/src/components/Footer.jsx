import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-400 to-purple-600 text-white py-6">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-8 mb-4">
          <button>Privacy Policy</button>
          <button>Terms of Use</button>
          <button>Contact</button>
        </div>
        <p className="text-sm">© 2025 MedBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;