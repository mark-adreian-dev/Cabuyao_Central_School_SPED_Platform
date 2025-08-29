import React from "react";

const StudentCard = ({ student }) => {
  return (
    <div key={student.id} className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        {student.user.profile_picture ? (
          <img
            src={`http://localhost:8000/${student.user.profile_picture}`}
            alt={`${student.user.first_name} ${student.user.last_name}`}
            className="w-16 h-16 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        <div>
          <p className="font-bold">{`${student.user.last_name}, ${student.user.first_name}`}</p>
          <p className="text-sm text-gray-600">Age: {student.user.age}</p>
        </div>
      </div>

      {student.disabilities && student.disabilities.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-semibold text-gray-700">Disabilities:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {student.disabilities.map((disability) => (
              <li key={disability.id}>{disability.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentCard;
