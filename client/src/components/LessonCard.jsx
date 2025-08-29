import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const LessonCard = ({ lesson }) => {
  const navigate = useNavigate();

  return (
    <div
      key={lesson.id}
      className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 flex flex-col justify-between"
      onClick={() => navigate(`/faculty/lessons/${lesson.id}`)}
    >
      <div>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center mr-4">
            <FaBook className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-brand-black font-roboto">
            {lesson.lesson_title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {lesson.lesson_description}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex space-x-4">
          <p className="text-sm text-gray-500">
            Comments: {lesson.comments_count}
          </p>
          <p className="text-sm text-gray-500">Files: {lesson.files_count}</p>
          <p className="text-sm text-gray-500">Links: {lesson.links_count}</p>
        </div>
        <button className="text-sm text-brand-green font-semibold hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
