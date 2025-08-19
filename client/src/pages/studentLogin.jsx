import React, { useContext, useRef } from "react";
import { UserContext } from "../contexts/UserContext";
import schoolLogo from "../assets/logo.png";
import heroImage from "../assets/login-desktop.png";

// Simple text-to-speech utility
const speak = (text) => {
  if ("speechSynthesis" in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  }
};

export default function studentLogin() {
  const { studentLogin } = useContext(UserContext);
  const studentNumberRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const req = await studentLogin(
      studentNumberRef.current.value,
      passwordRef.current.value
    );

    if (req.status === 200) {
      speak("Login successful! Redirecting to dashboard.");
    } else {
      speak("Login failed. Please check your credentials.");
    }
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center font-sans"
      aria-label="Login page for Cabuyao Central Elementary School LMS"
    >
      <section className="flex flex-row bg-white rounded-3xl shadow-lg overflow-hidden max-w-3xl w-full">
        {/* Hero Image */}
        <div
          className="login-hero hidden md:block flex-1 min-h-[400px] bg-center bg-cover"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden="true"
        />
        {/* Login Form */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <header className="flex items-center mb-8 gap-4">
            <img
              src={schoolLogo}
              alt="Cabuyao Central Elementary School Logo"
              className="w-16 h-16 rounded-full border-2 border-green-700 bg-white"
            />
            <h1
              className="text-2xl text-green-700 font-bold m-0"
              tabIndex={0}
              aria-label="Cabuyao Central Elementary School"
              onFocus={() => speak("Cabuyao Central Elementary School")}
            >
              Cabuyao Central Elementary School
            </h1>
          </header>
          <form
            onSubmit={handleSubmit}
            aria-label="Login form"
            className="flex flex-col gap-6"
          >
            <label
              htmlFor="studentNumber"
              className="font-bold text-green-700 flex items-center"
            >
              Student Number
              <button
                type="button"
                aria-label="Read Student Number field"
                className="ml-2 bg-none border-none text-green-700 cursor-pointer text-base"
                onClick={() => speak("Student Number")}
              >
                🔊
              </button>
            </label>
            <input
              ref={studentNumberRef}
              id="studentNumber"
              name="studentNumber"
              type="text"
              autoComplete="username"
              required
              aria-required="true"
              aria-label="Enter your student number"
              className="p-3 rounded-lg border border-green-100 text-base outline-none"
              onFocus={() => speak("Enter your student number")}
            />

            <label
              htmlFor="password"
              className="font-bold text-green-700 flex items-center"
            >
              Password
              <button
                type="button"
                aria-label="Read Password field"
                className="ml-2 bg-none border-none text-green-700 cursor-pointer text-base"
                onClick={() => speak("Password")}
              >
                🔊
              </button>
            </label>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-required="true"
              aria-label="Enter your password"
              className="p-3 rounded-lg border border-green-100 text-base outline-none"
              onFocus={() => speak("Enter your password")}
            />

            <button
              type="submit"
              className="bg-green-700 text-white font-bold p-3 rounded-lg border-none text-lg cursor-pointer transition-colors duration-200 hover:bg-green-800 focus:bg-green-800"
              aria-label="Login"
              onFocus={() => speak("Login")}
            >
              Login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
