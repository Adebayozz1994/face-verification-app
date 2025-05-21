// RegisterPage.js
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">
            FaceSecure
          </div>
          <div className="space-x-6">
            <a href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
              Login
            </a>
            <a href="/institution" className="text-gray-700 hover:text-indigo-600 font-medium">
              Sign Up
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium">
              Contact Us
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center px-6 bg-gradient-to-br from-indigo-100 to-white">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
          Secure Access, Powered by Your Face
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          FaceSecure uses advanced facial recognition technology to ensure seamless and secure access to your digital world.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/institution"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </a>
          <a
            href="#contact"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-50 transition duration-300"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="signup">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Fast Recognition</h3>
            <p className="text-gray-600">Detect and authenticate users in milliseconds with cutting-edge AI models.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Privacy First</h3>
            <p className="text-gray-600">We store only secure face descriptors. Your privacy is our top priority.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-600">Easy Integration</h3>
            <p className="text-gray-600">Add facial recognition to your apps in minutes using our simple API.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 text-center bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600">Reach out for support, feedback, or collaborations.</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        © 2025 FaceSecure. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
