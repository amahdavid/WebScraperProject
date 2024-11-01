import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResponses } from "../store/userSlice";

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const dispatch = useDispatch();
  const url = useSelector((state) => state.user.url);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: url }), // replace with actual scraped data later
        });

        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions);
        } else {
          console.error("Error generating questions: ", data.error);
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    fetchQuestions();
  }, [url]);

  const handleAnswerChange = (index, answer) => {
    const newResponses = [...responses];
    newResponses[index] = answer;
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    dispatch(setResponses(responses));
    // will display users classification after scraping
  };

  return (
    <div>
      <h1>QuestionPage</h1>
      {questions.map((question, index) => (
        <div key={index}>
          <p>{question}</p>
          <input
            type="text"
            placeholder="Your answer"
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Answers</button>
    </div>
  );
}

export default QuestionPage;
