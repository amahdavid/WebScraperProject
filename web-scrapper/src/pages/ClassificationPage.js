import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResponses } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

function ClassificationPage() {
  const [classification, setClassification] = useState("");
  const responses = useSelector((state) => state.user.responses);
  const navigate = useNavigate();

  useEffect(() => {
    const classifyUser = async () => {
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
                console.error("Error classifying user: ", data.error);
              }
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    classifyUser();
  }, [responses])

  return(
    <div>
      <h1>User Classification</h1>
      {classification ? (
        <p>Your classification: {classification}</p>
      ) : (
        <p>Classifying your responses...</p>
      )}
      <button onClick={() => navigate("/questions")}>Back to Questions</button>
      <button onClick={() => navigate("/")}>Enter a new Link!</button>
    </div>
  )
}

export default ClassificationPage;