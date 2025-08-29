import { createContext, useContext, useState } from "react";
import axios from "./axios";
import { UserContext } from "./UserContext";

export const LessonContext = createContext();

export const LessonProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/lessons");
      setLessons(response.data.lessons);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getLesson = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/lessons/${id}`);
      console.log(response.data.lesson);

      setLesson(response.data.lesson);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/lessons", lessonData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLessons([...lessons, response.data.lesson]);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (id, lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/lessons/${id}`, lessonData);
      setLessons(
        lessons.map((les) => (les.id === id ? response.data.lesson : les))
      );
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/lessons/${id}`);
      setLessons(lessons.filter((les) => les.id !== id));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getLessonsBySection = async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/lessons/section/${sectionId}`);
      setLessons(response.data.lessons);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addLessonToSection = async (lessonId, sectionId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/lessons/${lessonId}/add-section`, {
        section_id: sectionId,
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const removeLessonFromSection = async (lessonId, sectionId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/lessons/${lessonId}/remove-section`, {
        data: { section_id: sectionId },
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addFileToLesson = async (lessonId, fileData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/lessons/${lessonId}/file-upload`, fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFileFromLesson = async (fileId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/lessons/file-delete/${fileId}`);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addLinkToLesson = async (lessonId, linkData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/lessons/${lessonId}/add-link`, linkData);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const removeLinkFromLesson = async (linkId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/lessons/remove-link/${linkId}`);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getLessonsByFaculty = async (facultyId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/lessons/faculty/${facultyId}`);
      console.log(response.data.lessons);

      setLessons(response.data.lessons);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getLessonsByStudent = async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/lessons/student/${studentId}`);
      setLessons(response.data.lessons);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LessonContext.Provider
      value={{
        lessons,
        lesson,
        loading,
        error,
        getLessons,
        getLesson,
        createLesson,
        updateLesson,
        deleteLesson,
        getLessonsBySection,
        addLessonToSection,
        removeLessonFromSection,
        addFileToLesson,
        removeFileFromLesson,
        addLinkToLesson,
        removeLinkFromLesson,
        getLessonsByFaculty,
        getLessonsByStudent,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
