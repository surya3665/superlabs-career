import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import JobPost from "./context/JobDescription.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <JobPost>
      {" "}
      <App />
    </JobPost>
  </StrictMode>
);
