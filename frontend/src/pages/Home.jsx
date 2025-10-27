import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulate initial load (replace with real data fetching if needed)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Reusable variants
  const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  const sectionFadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
  };

  const containerStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        // Loader fades out smoothly before page fades in
        <Loader key="loader" />
      ) : (
        <motion.div
          key="home"
          className="bg-gray-50 text-gray-800"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Navbar (light slide-down on mount) */}
          <motion.header
            className="bg-white shadow-lg fixed mx-12 w-[90%] z-10 rounded-lg border border-gray-400"
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-indigo-600">CompileAI</h1>
              <nav className="space-x-6">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition"
                >
                  Contact
                </a>
                <a
                  href="/login"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition transform hover:scale-[1.02]"
                >
                  Login
                </a>
              </nav>
            </div>
          </motion.header>

          {/* Hero Section */}
          <motion.section
            className="pt-32 pb-24 m-2 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-5xl font-extrabold text-indigo-700 mb-6">
                Code. Compile. Conquer.
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                CompileAI is a powerful online judge for C++ coding with
                real-time compilation, error analysis, and AI-based hints.
              </p>
              <a
                href="/register"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02]"
              >
                Start Coding
              </a>
            </div>
          </motion.section>

          {/* Features */}
          <motion.section
            id="features"
            className="py-20 bg-white m-4 rounded-lg border border-gray-400 "
            variants={sectionFadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-12">
                Platform Features
              </h3>

              {/* stagger cards */}
              <motion.div
                className="grid md:grid-cols-3 gap-8"
                variants={containerStagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                <motion.div
                  variants={item}
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    Real-Time C++ Compiler
                  </h4>
                  <p className="text-gray-600">
                    Write, compile and run C++ code with instant output and
                    feedback.
                  </p>
                </motion.div>

                <motion.div
                  variants={item}
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    Role-Based Access
                  </h4>
                  <p className="text-gray-600">
                    Separate dashboards and access control for users and
                    administrators.
                  </p>
                </motion.div>

                <motion.div
                  variants={item}
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    AI Assistance
                  </h4>
                  <p className="text-gray-600">
                    Smart hint generation and error analysis to help you debug
                    and learn faster.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* About */}
          <motion.section
            id="about"
            className="py-20 bg-gray-100 m-4 rounded-lg border border-gray-400"
            variants={sectionFadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-5xl mx-auto px-4 text-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                Why CompileAI?
              </h3>

              <p className="text-gray-700 text-lg leading-relaxed mb-10">
                <span className="font-semibold">
                  AI is everywhere. But students stopped thinking.
                </span>
                <br />
                Most students now rely on AI to solve DSA problems instantly.
                They skip the <span className="italic">“why”</span> and{" "}
                <span className="italic">“how”</span>, losing confidence in real
                interviews. <span className="font-semibold">CompileAI</span>{" "}
                changes that. It guides you to think, not just copy.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-300 bg-white rounded-2xl shadow-sm">
                  <thead className="bg-gray-200 text-gray-800">
                    <tr>
                      <th className="px-4 py-3 border border-gray-300 text-lg font-semibold">
                        Traditional AI Tools
                      </th>
                      <th className="px-4 py-3 border border-gray-300 text-lg font-semibold">
                        CompileAI
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-300">
                        Gives full code
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        Guides your thought process
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-300">
                        Encourages copying
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        Builds intuition
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-300">
                        No real learning
                      </td>
                      <td className="px-4 py-3 border border-gray-300">
                        Promotes understanding
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section
            id="benefits"
            className="py-20 bg-white m-4 rounded-lg border border-gray-300 shadow-sm"
            variants={sectionFadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                Benefits of Using CompileAI
              </h3>
              <p className="text-gray-600 text-lg mb-12">
                Designed to help you{" "}
                <span className="font-semibold text-indigo-600">
                  think, code, and improve
                </span>{" "}
                — not just copy. CompileAI makes learning DSA efficient and
                meaningful with AI that mentors, not replaces.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    💡 AI-Guided Learning
                  </h4>
                  <p className="text-gray-600">
                    Get help with intuition and approach instead of ready-made
                    code. Learn how to think like an engineer.
                  </p>
                </motion.div>

                {/* 2 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    🧠 Build Real Understanding
                  </h4>
                  <p className="text-gray-600">
                    Strengthen your DSA concepts through guided exploration and
                    hints — not spoon-feeding.
                  </p>
                </motion.div>

                {/* 3 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    📈 Personalized Progress
                  </h4>
                  <p className="text-gray-600">
                    Track your submissions and growth with a detailed history
                    and feedback-driven improvement.
                  </p>
                </motion.div>

                {/* 4 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    🧑‍💻 Hands-on Practice
                  </h4>
                  <p className="text-gray-600">
                    Solve coding problems with a built-in compiler and see
                    instant results — just like real interviews.
                  </p>
                </motion.div>

                {/* 5 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    🧑‍🏫 No Teacher Needed
                  </h4>
                  <p className="text-gray-600">
                    The AI review feature acts as your mentor — explaining,
                    guiding, and helping you debug your logic.
                  </p>
                </motion.div>

                {/* 6 */}
                <motion.div
                  className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  <h4 className="text-xl font-semibold text-indigo-600 mb-2">
                    🏆 Interview Readiness
                  </h4>
                  <p className="text-gray-600">
                    Practice DSA problems the way top companies test you — with
                    logic, optimization, and structured problem-solving.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Contact */}
          <motion.section
            id="contact"
            className="py-20 bg-white m-4 rounded-lg border border-gray-400"
            variants={sectionFadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h3 className="text-3xl font-semibold text-gray-800 mb-6">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-6">
                Have feedback, suggestions, or want to collaborate?
              </p>
              <p className="text-gray-600">Mail the improvements needed</p>
              <a
                href="mailto:hariharanr466@gmail.com"
                className="text-indigo-600 font-medium hover:underline"
              >
                hariharanr466@gmail.com
              </a>
            </div>
          </motion.section>

          {/* Footer */}
          <motion.footer
            className="bg-gray-900 text-white text-center py-6 rounded-lg m-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p>
              &copy; {new Date().getFullYear()} CompileAI. All rights reserved.
            </p>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
