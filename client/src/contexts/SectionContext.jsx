import { createContext, useContext, useState } from "react";
import axios from "./axios";

export const SectionContext = createContext();

export const SectionProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/sections");
      setSections(response.data.sections);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getSection = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/sections/${id}`);
      return response.data.section;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (sectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/sections", sectionData);
      fetchSections(); // Refresh the list of sections
      return response.data.section;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (id, sectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/sections/${id}`, sectionData);
      fetchSections(); // Refresh the list of sections
      return response.data.section;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSection = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/sections/${id}`);
      fetchSections(); // Refresh the list of sections
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentSections = async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/sections/student/${studentId}`);
      return response.data.sections;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getFacultySections = async (facultyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/sections/faculty/${facultyId}`);
      console.log(response.data);

      return response.data.sections;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStudentsByFaculty = async (facultyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/sections/faculty/${facultyId}/students`
      );
      return response.data.students;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addStudentsToSection = async (sectionId, studentIds) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/sections/${sectionId}/add-students`, {
        students: studentIds,
      });
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeStudentFromSection = async (sectionId, studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `/sections/${sectionId}/remove-student`,
        {
          data: { student_id: studentId },
        }
      );
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionContext.Provider
      value={{
        sections,
        loading,
        error,
        fetchSections,
        getSection,
        createSection,
        updateSection,
        deleteSection,
        getStudentSections,
        getFacultySections,
        getStudentsByFaculty,
        addStudentsToSection,
        removeStudentFromSection,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export const useSections = () => useContext(SectionContext);
