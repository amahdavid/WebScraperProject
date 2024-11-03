import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ClassificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const classification = location.state?.classification || null;

  return (
    <div>
      <h1>User Classification</h1>
      {classification ? (
        <div>
          <h2>Your classification results:</h2>
          <p>{classification}</p>
        </div>
      ) : (
        <p>No classification data available.</p>
      )}
      <button onClick={() => navigate("/questions")}>Back to Questions</button>
      <button onClick={() => navigate("/")}>Enter a new Link!</button>
    </div>
  );
}

export default ClassificationPage;
