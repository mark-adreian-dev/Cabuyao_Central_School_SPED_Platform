import React from "react";
import { useNavigate } from "react-router-dom";

const SectionCard = ({ section }) => {
  const navigate = useNavigate();

  return (
    <div
      key={section.id}
      className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300"
      onClick={() => navigate(`/faculty/sections/${section.id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-brand-black font-roboto">
            {section.section_name}
          </h3>
          <p className="text-gray-500 text-sm">Grade {section.grade_level}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full ${
            section.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {section.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="font-medium">School Year:</span>
          <span>{section.school_year}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
          <span className="font-medium">Students:</span>
          <span>{section.students.length}</span>
        </div>
        {section.disability && (
          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            <span className="font-medium">Disability:</span>
            <span>{section.disability.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;
