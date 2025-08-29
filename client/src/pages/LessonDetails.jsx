import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LessonContext } from "../contexts/LessonContext";
import { SectionContext } from "../contexts/SectionContext";
import { UserContext } from "../contexts/UserContext";
import { FaFilePdf, FaLink, FaBook, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";

const LessonDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { getLesson, lesson, addLessonToSection, removeLessonFromSection } =
    useContext(LessonContext);
  const { getFacultySections } = useContext(SectionContext);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    getLesson(id);
    if (user) {
      getFacultySections(user.faculty.id).then((data) => {
        setSections(data);
      });
    }
  }, [id, user]);

  const handleRemoveSection = (sectionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeLessonFromSection(lesson.id, sectionId).then(() => {
          getLesson(id);
          Swal.fire("Removed!", "The section has been removed.", "success");
        });
      }
    });
  };

  const handleAddSection = () => {
    if (selectedSection) {
      addLessonToSection(lesson.id, selectedSection.value).then(() => {
        getLesson(id);
        setSelectedSection(null);
        Swal.fire("Added!", "The section has been added.", "success");
      });
    }
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-brand-green flex items-center justify-center mr-4">
            <FaBook className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-brand-black font-roboto">
              {lesson.lesson_title}
            </h1>
            <p className="text-gray-600 mt-1">{lesson.lesson_description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-brand-black font-roboto mb-4">
              Attached Files
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.files.map((file) => (
                <a
                  key={file.id}
                  href={file.lesson_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-4 rounded-lg flex items-center hover:bg-gray-200 transition-all duration-300"
                >
                  <FaFilePdf className="h-6 w-6 text-red-500 mr-3" />
                  <span className="text-sm font-medium">{file.file_name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-brand-black font-roboto mb-4">
              Attached Links
            </h2>
            <div className="space-y-3">
              {lesson.links.map((link) => (
                <a
                  key={link.id}
                  href={link.lesson_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 p-4 rounded-lg flex items-center hover:bg-gray-200 transition-all duration-300"
                >
                  <FaLink className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium">{link.link_name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold text-brand-black font-roboto mb-4">
            Assigned Sections
          </h2>
          <div className="flex-grow overflow-y-auto space-y-3 mb-4">
            {lesson.sections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-100 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{section.section_name}</p>
                  <p className="text-xs text-gray-600">
                    Grade {section.grade_level}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <Select
                isSearchable={false}
                menuPlacement="top"
                options={sections
                  .filter(
                    (section) =>
                      !lesson.sections.some(
                        (assignedSection) => assignedSection.id === section.id
                      )
                  )
                  .map((section) => ({
                    value: section.id,
                    label: section.section_name,
                  }))}
                value={selectedSection}
                onChange={setSelectedSection}
                className="flex-grow"
              />
              <button
                onClick={handleAddSection}
                className="bg-brand-green text-white px-4 py-2 rounded-lg ml-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
