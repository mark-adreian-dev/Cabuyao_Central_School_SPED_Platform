import React from "react";

const PrincipalDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-black font-roboto">
        Welcome, Principal!
      </h1>
      <p className="mt-2 text-gray-600 font-poppins">
        This is your dashboard. Here you can manage students, faculty, and view
        school-wide analytics.
      </p>
    </div>
  );
};

export default PrincipalDashboard;
