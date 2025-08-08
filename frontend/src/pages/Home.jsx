import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">CompileAI</h1>
          <nav className="space-x-6">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
            <a href="/login" className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md">Login</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-indigo-700 mb-6">
            Code. Compile. Conquer.
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            CompileAI is a powerful online judge for C++ coding with real-time compilation, error analysis, and AI-based hints.
          </p>
          <a href="/register" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition">
            Start Coding
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-12">Platform Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-indigo-600 mb-2">Real-Time C++ Compiler</h4>
              <p className="text-gray-600">Write, compile and run C++ code with instant output and feedback.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-indigo-600 mb-2">Role-Based Access</h4>
              <p className="text-gray-600">Separate dashboards and access control for users and administrators.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition">
              <h4 className="text-xl font-semibold text-indigo-600 mb-2">AI Assistance (Coming Soon)</h4>
              <p className="text-gray-600">Smart hint generation and error analysis to help you debug and learn faster.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-100 m-4 rounded-lg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-4">About CompileAI</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            CompileAI is a MERN-stack based online judge platform designed for learners, competitive programmers,
            and educators. Built with passion to learn, and this is a personal project that I have built. It brings together powerful features like real-time C++ compilation, question management, and future-ready AI assistance. 
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white m-4 rounded-lg">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
          <p className="text-gray-600 mb-6">Have feedback, suggestions, or want to collaborate?</p>
          <p className="text-gray-600 ">Mail the improvements needed </p>
          <a href="mailto:hariharanr466@gmail.com" className="text-indigo-600 font-medium hover:underline">
            hariharanr466@gmail.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6">
        <p>&copy; {new Date().getFullYear()} CompileAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
