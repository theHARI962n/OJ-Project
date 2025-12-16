import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-16">

      {/* Navbar */}
      <Navbar />
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Admin Studio 
      </h1>

      {/* Hook Line */}
      <p className="text-gray-600 text-lg mb-12 max-w-xl text-center">
        🚀 Power up your platform — start managing problems effectively.  
        Choose an option from the actions below.
      </p>

      {/* Cards Wrapper */}
      <div className="grid sm:grid-cols-2 gap-8 w-full max-w-4xl">

        {/* Card 1 - Manage Problems */}
        <Link
          to="/admin/problems"
          className="
            group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 
            cursor-pointer transition-all 
            hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400
          "
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition">
            📚
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Manage Problems
          </h2>
          <p className="text-gray-600">
            View, edit, and organize all existing coding problems.
          </p>
        </Link>

        {/* Card 2 - Create New Problem */}
        <Link
          to="/admin/problems/create"
          className="
            group bg-white p-8 rounded-2xl shadow-sm border border-gray-200
            cursor-pointer transition-all 
            hover:shadow-xl hover:-translate-y-1 hover:border-indigo-400
          "
        >
          <div className="text-4xl mb-4 group-hover:scale-110 transition">
            ✏️
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Create New Problem
          </h2>
          <p className="text-gray-600">
            Add new challenges with descriptions, constraints, and test cases.
          </p>
        </Link>

      </div>
    </div>
  );
}
