import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-blue-900 text-white py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="space-y-4 text-center sm:text-left">
          <img
            src="/mentalhealthicon.png" // Replace with your logo image path
            alt="SwapSaviour Logo"
            className="w-20 mx-auto sm:mx-0"
          />
          <p className="text-gray-300 text-sm">
            Accessible, Anonymous, Always Here. <br />
            Real strength lies in reaching out, asking for help, and taking control of your journey.
          </p>
          <div className="flex justify-center sm:justify-start space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="text-primary bg-gray-200 hover:bg-primary hover:text-white p-3 rounded-full transition-all"
                aria-label={`Social Link ${index + 1}`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="text-gray-300 hover:text-white hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#about-us" className="text-gray-300 hover:text-white hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="text-gray-300 hover:text-white hover:underline">
                Services
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-300 hover:text-white hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2">
            {["FAQs", "Terms of Service", "Support Center"].map((link, idx) => (
              <li key={idx}>
                <a href="#" className="text-gray-300 hover:text-white hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
          <ul className="space-y-2">
            <li>200 Old Avenue, Greater London, UK</li>
            <li>+123 768 6398</li>
            <li>info@swapsaviour.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-sm mt-8">
        <p>&copy; 2025 SwapSaviour. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
