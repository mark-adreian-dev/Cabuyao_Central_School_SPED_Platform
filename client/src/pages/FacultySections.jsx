import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { SectionContext } from "../contexts/SectionContext";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";

const FacultySections = () => {
  const { user } = useContext(UserContext);
  const { getFacultySections } = useContext(SectionContext);
  const [sections, setSections] = useState([]);
  const [stats, setStats] = useState({
    activeSections: 0,
    totalSections: 0,
    avgStudentsPerSection: 0,
  });

  useEffect(() => {
    if (user) {
      getFacultySections(user.faculty.id).then((data) => {
        setSections(data);
        console.log(data);

        calculateStats(data);
      });
    }
  }, [user]);

  const calculateStats = (sectionsData) => {
    const activeSections = sectionsData.filter((s) => s.isActive).length;
    const totalSections = sectionsData.length;
    const totalStudents = sectionsData.reduce(
      (acc, section) => acc + section.students.length,
      0
    );
    const avgStudentsPerSection =
      totalSections > 0 ? (totalStudents / totalSections).toFixed(2) : 0;

    setStats({
      activeSections,
      totalSections,
      avgStudentsPerSection,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-black font-roboto mb-8">
        My Sections
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-black">
            Active Sections
          </h2>
          <p className="text-3xl font-roboto text-brand-green mt-2">
            {stats.activeSections}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-black">Total Sections</h2>
          <p className="text-3xl font-roboto text-brand-green mt-2">
            {stats.totalSections}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-brand-black">
            Avg. Students per Section
          </h2>
          <p className="text-3xl font-roboto text-brand-green mt-2">
            {stats.avgStudentsPerSection}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections &&
          sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
      </div>
    </div>
  );
};

export default FacultySections;
