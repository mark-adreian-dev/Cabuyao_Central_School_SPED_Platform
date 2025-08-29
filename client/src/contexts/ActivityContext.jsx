import { createContext, useContext, useState } from "react";
import axios from "./axios";
import { UserContext } from "./UserContext";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [studentActivities, setStudentActivities] = useState([]);
  const [activity, setActivity] = useState(null);
  const [studentActivity, setStudentActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //for faculty
  const getActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/activities");
      setActivities(response.data.activities);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivity = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/activities/${id}`);
      setActivity(response.data.activity);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/activities", activityData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setActivities([...activities, response.data.activity]);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (id, activityData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/activities/${id}`, activityData);
      setActivities(
        activities.map((act) => (act.id === id ? response.data.activity : act))
      );
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/activities/${id}`);
      setActivities(activities.filter((act) => act.id !== id));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivitiesBySection = async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/activities/section/${sectionId}`);
      setActivities(response.data.activities);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addActivityToSection = async (activityId, sectionData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/activities/${activityId}/add-section`, sectionData);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const removeActivityFromSection = async (activityId, sectionId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/activities/${activityId}/remove-section`, {
        data: { section_id: sectionId },
      });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const addFileToActivity = async (activityId, fileData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/activities/${activityId}/file-upload`, fileData, {
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

  const removeFileFromActivity = async (fileId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/activities/file-delete/${fileId}`);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //for student
  const getStudentActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/activities/student");
      setStudentActivities(response.data.student_activities);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentActivity = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/activities/student/${id}`);
      setStudentActivity(response.data.student_activity);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const createStudentActivity = async (activityData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/activities/student", activityData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStudentActivities([
        ...studentActivities,
        response.data.student_activity,
      ]);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudentActivity = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/activities/student/${id}`);
      setStudentActivities(studentActivities.filter((act) => act.id !== id));
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentActivitiesBySection = async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/activities/student/section/${sectionId}`
      );
      setStudentActivities(response.data.student_activities);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const markStudentActivity = async (id, scoreData) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/activities/student/${id}/mark`, scoreData);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        studentActivities,
        activity,
        studentActivity,
        loading,
        error,
        getActivities,
        getActivity,
        createActivity,
        updateActivity,
        deleteActivity,
        getActivitiesBySection,
        addActivityToSection,
        removeActivityFromSection,
        addFileToActivity,
        removeFileFromActivity,
        getStudentActivities,
        getStudentActivity,
        createStudentActivity,
        deleteStudentActivity,
        getStudentActivitiesBySection,
        markStudentActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
