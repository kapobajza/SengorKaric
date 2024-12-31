const { execSync } = require("child_process");

// Check if running in CI
const isCI = process.env.CI?.toLocaleLowerCase()?.trim() === "true";

if (!isCI) {
  try {
    execSync("lefthook install", { stdio: "inherit" });
  } catch (error) {
    console.error("Error running lefthook install:", error);
  }
}
