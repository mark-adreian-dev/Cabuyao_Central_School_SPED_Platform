import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Volume2 } from "lucide-react";
import { UserContext } from "../../contexts/UserContext";
import logo from "../../assets/Logo.png";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { studentLogin } = useContext(UserContext);
  const [formData, setFormData] = useState({
    studentNumber: "",
    password: "",
  });
  const MySwal = withReactContent(Swal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentLogin(formData.studentNumber, formData.password);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = "Invalid student ID or password. Please try again.";
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      speak(errorMessage);
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-white flex flex-col md:flex-row items-center justify-center font-poppins max-h-screen">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Cabuyao Central School SPED Platform Logo"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-brand-green font-roboto">
              Welcome Student!
            </h1>
            <p className="text-gray-600 mt-2">
              Cabuyao Central Elementary School
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="studentNumber"
                  className="text-lg font-medium text-brand-black"
                >
                  Student ID
                </label>
                <button
                  type="button"
                  onClick={() => speak("Please enter your Student ID.")}
                  className="text-gray-500 hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green rounded-full"
                  aria-label="Listen to student ID instructions"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                aria-label="Student ID"
                autoComplete="username"
                value={formData.studentNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition duration-300"
                placeholder="Enter your Student ID"
              />
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-lg font-medium text-brand-black"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => speak("Please enter your password.")}
                  className="text-gray-500 hover:text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green rounded-full"
                  aria-label="Listen to password instructions"
                >
                  <Volume2 size={24} />
                </button>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                aria-label="Password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition duration-300"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-green text-white font-bold text-lg py-3 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-green focus:ring-opacity-50 transition duration-300"
              aria-label="Log in to your account"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
