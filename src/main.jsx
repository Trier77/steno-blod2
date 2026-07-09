import { StrictMode } from "react";
import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";

// Forhindrer browser-swipe-navigation globalt
document.addEventListener("touchmove", (e) => {
  e.preventDefault();
}, { passive: false });

// Skjuler musen som standard — vises igen ved musebevægelse, skjules ved touch
document.body.style.cursor = "none";
document.addEventListener("mousemove", () => {
  document.body.style.cursor = "auto";
});
document.addEventListener("touchstart", () => {
  document.body.style.cursor = "none";
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
