import { Route, Routes } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";
import StartSide from "./pages/StartSide";
import Quiz from "./pages/Quiz";
import VideoPage from "./pages/VideoPage";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<StartSide />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
