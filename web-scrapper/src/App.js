import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import URLInputPage from "./pages/URLInputPage";
import QuestionPage from "./pages/QuestionPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLInputPage />} />
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
