import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import URLInputPage from "./pages/URLInputPage/URLInputPage";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import ClassificationPage from "./pages/ClassificationPage/ClassificationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLInputPage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/classification" element={<ClassificationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
