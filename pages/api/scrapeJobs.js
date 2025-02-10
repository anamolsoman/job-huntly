// /pages/api/scrapeJobs.js

import puppeteer from "puppeteer";
import { scrapeJobPostings } from "../../utils/scrapeJobPostings";

export default async function handler(req, res) {
  const { url, filters } = req.query;

  // Validate that the URL is provided
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log(url, "url");
    const filterOptions = filters ? JSON.parse(filters) : {}; // Parse filters from query string
    const jobs = await scrapeJobPostings(url, filterOptions);
    console.log(jobs, "jobs");

    if (jobs.length === 0) {
      return res
        .status(200)
        .json({ message: "No job postings found matching the filters." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error while scraping:", error);
    res.status(500).json({
      error: "An error occurred while scraping the page",
      details: error.message,
    });
  }
}
