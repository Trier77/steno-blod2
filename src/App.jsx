import { Route, Routes } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";
import StartSide from "./pages/StartSide";
import Quiz from "./pages/Quiz";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<StartSide />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
