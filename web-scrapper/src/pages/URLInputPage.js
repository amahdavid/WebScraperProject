import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUrl, fetchData, setResponses } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

function URLInputPage() {
  const [inputUrl, setInputUrl] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputUrl(event.target.value);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(setUrl(inputUrl));

  try {
      const fetchPromise = dispatch(fetchData(inputUrl));
      const resultAction = await fetchPromise;
      
      if (fetchData.fulfilled.match(resultAction)) {
          const themes = resultAction.payload.themes;
          dispatch(setResponses(themes));
          navigate("/questions");
      } else {
          throw new Error(resultAction.error.message);
      }
  } catch (error) {
      console.error("Error scraping: ", error);
  }
};

  return (
    <div>
      <h1>Enter Website URL</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={inputUrl}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default URLInputPage;
