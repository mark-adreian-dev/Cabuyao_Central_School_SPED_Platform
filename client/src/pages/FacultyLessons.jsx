import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { LessonContext } from "../contexts/LessonContext";
import { useNavigate } from "react-router-dom";
import LessonCard from "../components/LessonCard";

const FacultyLessons = () => {
  const { user } = useContext(UserContext);
  const { getLessonsByFaculty, lessons } = useContext(LessonContext);
  //   const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user);

      getLessonsByFaculty(user.faculty.id);
    }
  }, [user]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-black font-roboto">
          My Lessons
        </h1>
        <button
          onClick={() => navigate("/faculty/lessons/create")}
          className="bg-brand-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-green-dark transition-all duration-300"
        >
          Create Lesson
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons &&
          lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
      </div>
    </div>
  );
};

export default FacultyLessons;
