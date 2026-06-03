import { useState } from "react";
import { Route, Routes } from "react-router";
import { LanguageProvider } from "./context/LanguageContext";
import { BlobProvider, useBlob } from "./context/BlobContext.jsx";
import StartSide from "./pages/StartSide";
import Quiz from "./pages/Quiz";
import VideoPage from "./pages/VideoPage";
import "./App.css";

const BLOB_BOTTOM_LEFT = `
  M32.7,-50.8C45.8,-42.5,62,-39.1,65.1,-30.3C68.2,-21.5,58.1,-7.3,51.7,4.4C45.2,16,42.3,25.1,36.8,32.6C31.4,40,23.3,45.8,14.3,48.2C5.4,50.7,-4.5,49.6,-13.5,46.7C-22.5,43.7,-30.7,38.7,-32.9,31.3C-35.2,23.8,-31.4,13.9,-34.9,3.7C-38.5,-6.5,-49.4,-17,-52.5,-29.6C-55.5,-42.2,-50.8,-57,-40.7,-66.6C-30.7,-76.2,-15.4,-80.7,-2.8,-76.4C9.8,-72.1,19.7,-59,32.7,-50.8Z
`;

const EXPAND_SCALE = 50 / 8;

function PersistentQuizBlob() {
  const { expanded } = useBlob();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: expanded ? 5 : 2,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "visible",
        }}
      >
        <g transform="translate(600 1150) scale(8) rotate(110)">
          <path
            d={BLOB_BOTTOM_LEFT}
            fill="#3d1118"
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
              transition: "transform 1.5s ease-in-out",
              transform: expanded ? `scale(${EXPAND_SCALE})` : "scale(1)",
            }}
          />
          <path
            d={BLOB_BOTTOM_LEFT}
            fill="#631d27"
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
              transition: "transform 1.5s ease-in-out",
              transform: expanded ? `scale(${EXPAND_SCALE})` : "scale(1)",
            }}
          />
        </g>
      </svg>
    </div>
  );
}

function AppInner() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <PersistentQuizBlob />
      <Routes>
        <Route path="/" element={<StartSide />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BlobProvider>
        <AppInner />
      </BlobProvider>
    </LanguageProvider>
  );
}

export default App;
