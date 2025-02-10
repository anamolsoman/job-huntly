import puppeteer from "puppeteer";
import { setTimeout } from "node:timers/promises";

// ...

export const scrapeJobPostings = async (url, filters) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    console.log("Puppeteer version:", puppeteer.version);
    console.log("Navigating to URL:", url);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait for dynamic content to load
    await setTimeout(3000);

    console.log("Extracting page content.");
    const jobData = await page.evaluate((filters) => {
      const elements = document.querySelectorAll("*");
      const results = [];

      elements.forEach((el) => {
        console.log(el, "el");
        const text = el.innerText?.trim();
        const link = el.closest("a")?.href;

        if (text && link) {
          const isTitleMatch =
            !filters.title ||
            text.toLowerCase().includes(filters.title.toLowerCase());
          const isExperienceMatch =
            !filters.experience ||
            text.toLowerCase().includes(filters.experience.toLowerCase());

          if (isTitleMatch && isExperienceMatch) {
            results.push({ text, link });
          }
        }
      });

      return results;
    }, filters);

    console.log("Scraping completed. Results:", jobData);
    await browser.close();
    return jobData;
  } catch (error) {
    console.error("Error while scraping:", error.message);
    await browser.close();
    throw new Error(`Error while scraping: ${error.message}`);
  }
};
