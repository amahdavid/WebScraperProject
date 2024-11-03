import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ClassificationPage() {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const responses = useSelector((state) => state.user.responses);
  const navigate = useNavigate();

  useEffect(() => {
    const classifyUser = async () => {
      if (!responses || responses.length === 0) {
        setErrorMessage("No responses available for classification.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:5000/classify_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ responses }),
        });

        const data = await response.json();
        if (response.ok) {
          setClassification(data.classification);
        } else {
          setErrorMessage(data.error || "An error occurred during classification.");
        }
      } catch (error) {
        setErrorMessage("Fetch error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    classifyUser();
  }, [responses]);

  return (
    <div>
      <h1>User Classification</h1>
      {loading ? (
        <p>Classifying your responses...</p>
      ) : errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : (
        <div>
          <h2>Your classification results:</h2>
          <ul>
            {classification.labels.map((label, index) => (
              <li key={index}>
                {label}: {classification.scores[index].toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Input Sequence: {classification.sequence}</p>
        </div>
      )}
      <button onClick={() => navigate("/questions")}>Back to Questions</button>
      <button onClick={() => navigate("/")}>Enter a new Link!</button>
    </div>
  );
}

export default ClassificationPage;
