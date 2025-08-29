import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SectionContext } from "../contexts/SectionContext";
import StudentCard from "../components/StudentCard";

const SectionDetails = () => {
  const { id } = useParams();
  const { getSection } = useContext(SectionContext);
  const [section, setSection] = useState(null);

  useEffect(() => {
    getSection(id).then((data) => {
      setSection(data);
    });
  }, [id]);

  if (!section) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-black font-roboto mb-4">
        {section.section_name}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <p>
          <strong>Grade Level:</strong> {section.grade_level}
        </p>
        <p>
          <strong>School Year:</strong> {section.school_year}
        </p>
        <p>
          <strong>Status:</strong> {section.isActive ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Students:</strong> {section.students.length}
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-brand-black font-roboto mb-4">
          Students
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionDetails;
