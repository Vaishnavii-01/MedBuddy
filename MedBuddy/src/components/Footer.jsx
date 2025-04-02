import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-400 to-purple-600 text-white py-10">
      {/* Footer Content */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1 - Health Services */}
          <div>
            <h3 className="text-xl font-semibold">Health</h3>
            <ul className="mt-3 space-y-2">
              <li>Book Medicines</li>
              <li>Doctor Consultation</li>
              <li>Lab Tests</li>
              <li>Covid Essentials</li>
            </ul>
          </div>

          {/* Column 2 - Policies */}
          <div>
            <h3 className="text-xl font-semibold">Our Policies</h3>
            <ul className="mt-3 space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
              <li>Refund Policy</li>
            </ul>
          </div>

          {/* Column 3 - About & Socials */}
          <div>
            <h3 className="text-xl font-semibold">About</h3>
            <ul className="mt-3 space-y-2">
              <li>Overview</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>

            {/* Social Icons */}
            <div className="mt-5 flex justify-center md:justify-start space-x-4">
              <span className="cursor-pointer text-2xl">🌐</span>
              <span className="cursor-pointer text-2xl">📧</span>
              <span className="cursor-pointer text-2xl">📱</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-10 text-center text-sm">© 2025 MedBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;