// /components/JobSearchForm.js

import { useState } from "react";

const JobSearchForm = () => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filterParams = {
      title,
      experience,
    };

    const query = new URLSearchParams({
      url,
      filters: JSON.stringify(filterParams),
    }).toString();

    try {
      const response = await fetch(`/api/scrapeJobs?${query}`);
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        console.log(data);
        setJobs(data);
      }
    } catch (error) {
      alert("An error occurred while fetching job postings.");
    }
  };

  return (
    <div>
      <h2>Search for Job Postings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Career Page URL:</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Experience Level:</label>
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      <h3>Job Postings:</h3>
      <ul>
        {jobs.length === 0
          ? "No job postings found."
          : jobs.map((job, index) => (
              <li key={index}>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  {job.text} {job.experience}
                </a>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default JobSearchForm;
