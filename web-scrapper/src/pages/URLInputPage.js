import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUrl } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

function URLInputPage() {
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setUrl(url));

    try {
      const response = await fetch("http://127.0.0.1:5000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("http://127.0.0.1:5000/questions");
      } else {
        console.error("Error scraping: ", data.error);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  return (
    <div>
      <h1>Enter Website URL</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default URLInputPage;
