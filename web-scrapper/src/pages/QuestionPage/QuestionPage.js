import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResponses } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionPage.module.css";

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponsesState] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themes = useSelector((state) => state.user.themes);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!themes || themes.length === 0) {
        console.error("No themes available for generating questions.");
        return;
      }
      try {
        const response = await fetch("http://127.0.0.1:5000/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ themes: themes }),
        });

        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions);
          setResponsesState(Array(data.questions.length).fill(""));
        } else {
          console.error("Error generating questions: ", data.error);
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    fetchQuestions();
  }, [themes]);

  const handleAnswerChange = (index, answer) => {
    const newResponses = [...responses];
    newResponses[index] = answer;
    setResponsesState(newResponses);
  };

  const handleSubmit = async () => {
    try {
      dispatch(setResponses(responses));
      const response = await fetch("http://127.0.0.1:5000/classify_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses, questions }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/classification", {
          state: { classification: data.classification },
        });
      } else {
        console.error("Error classifying user: ", data.error);
      }
    } catch (error) {
      console.error("Error submitting responses: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Questions</h1>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <div key={index} className={styles.questionBlock}>
            <p className={styles.questionText}>{question}</p>
            <label className={styles.label}>
              <input
                type="radio"
                name={`question${index}`}
                value="Yes"
                onChange={() => handleAnswerChange(index, "Yes")}
              />
              Yes
            </label>
            <label className={styles.label}>
              <input
                type="radio"
                name={`question${index}`}
                value="No"
                onChange={() => handleAnswerChange(index, "No")}
              />
              No
            </label>
            <label className={styles.label}>
              <input
                type="radio"
                name={`question${index}`}
                value="Maybe"
                onChange={() => handleAnswerChange(index, "Maybe")}
              />
              Maybe
            </label>
          </div>
        ))
      ) : (
        <p>Loading questions...</p>
      )}
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit Answers
      </button>
    </div>
  );
}

export default QuestionPage;
