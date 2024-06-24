import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./Pages/Profile";
import "react-image-crop/dist/ReactCrop.css";
import PreviewPage from "./Pages/PreviewPage";
import HomePage from "./Pages/HomePage";
import AdminPanel from "./Pages/AdminPanel";

function App() {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
