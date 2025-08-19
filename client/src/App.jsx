import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import StudentLogin from "./pages/studentLogin.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={() => {
              return <h1>Welcome to the App</h1>;
            }}
          />
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/login/faculty" element={<StudentLogin />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
