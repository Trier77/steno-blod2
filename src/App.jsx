import { Route, Routes, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { useLanguage } from "./context/LanguageContext";
import { BlobProvider, useBlob } from "./context/BlobContext";
import translations from "../translations";
import Quiz from "./pages/Quiz";
import VideoPage from "./pages/VideoPage";
import FlagButton from "./components/FlagButton";
import questionIcon from "./assets/icons/question.png";
import playIcon from "./assets/icons/play-button.png";
import "./App.css";

const BLOB_TOP_RIGHT = `
  M20.2,-27.1C33.6,-22.9,57,-29.8,58.3,-26.7C59.6,-23.6,38.7,-10.5,32.7,2C26.7,14.5,35.5,26.5,36.3,38.7C37,50.9,29.6,63.3,19.9,64.9C10.2,66.4,-1.9,57,-17.9,55C-34,53.1,-54,58.6,-63,52.3C-72.1,46,-70.1,27.9,-60.3,16.1C-50.4,4.3,-32.6,-1.2,-28.7,-14.5C-24.8,-27.7,-34.7,-48.6,-32.3,-57.9C-29.8,-67.2,-14.9,-64.8,-5.7,-55.8C3.4,-46.9,6.8,-31.4,20.2,-27.1Z
`;
const BLOB_BOTTOM_LEFT = `
  M32.7,-50.8C45.8,-42.5,62,-39.1,65.1,-30.3C68.2,-21.5,58.1,-7.3,51.7,4.4C45.2,16,42.3,25.1,36.8,32.6C31.4,40,23.3,45.8,14.3,48.2C5.4,50.7,-4.5,49.6,-13.5,46.7C-22.5,43.7,-30.7,38.7,-32.9,31.3C-35.2,23.8,-31.4,13.9,-34.9,3.7C-38.5,-6.5,-49.4,-17,-52.5,-29.6C-55.5,-42.2,-50.8,-57,-40.7,-66.6C-30.7,-76.2,-15.4,-80.7,-2.8,-76.4C9.8,-72.1,19.7,-59,32.7,-50.8Z
`;

const QUIZ_EXPAND_SCALE = 35 / 8;
const VIDEO_EXPAND_SCALE = 35 / 9;

// ─────────────────────────────────────────────────────────────
// QUIZ BLOB IKONER — juster hvert ikon her
// x, y        → placering inde i blobben (-60 til 60 ca.)
// size        → størrelse
// opacity     → synlighed (0.05 = meget subtil, 0.3 = tydelig)
// rotation    → grader (0-360)
// ─────────────────────────────────────────────────────────────
const QUIZ_ICONS = [
  { x: -51, y: -55, size: 18, opacity: 0.3, rotation: -130 },
  { x: -18, y: 14, size: 14, opacity: 0.3, rotation: -110 },

  { x: -16, y: 22, size: 21, opacity: 0.3, rotation: 210 },
];
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// VIDEO BLOB IKON
// x, y        → placering inde i blobben
// size        → størrelse
// opacity     → synlighed
// rotation    → grader
// ─────────────────────────────────────────────────────────────
const VIDEO_ICON = { x: -20, y: -20, size: 45, opacity: 0.15, rotation: 0 };
// ─────────────────────────────────────────────────────────────

function WaveText({
  lines,
  x,
  y,
  animationDelay = 0,
  fade = false,
  fontSize = 78,
}) {
  const lineHeight = fontSize * 1.3;
  const totalLines = lines.length;
  const startY = y - ((totalLines - 1) * lineHeight) / 2;
  return (
    <g
      style={{
        animation: `textFloat 3s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {lines.map((line, li) => (
        <text
          key={li}
          x={x}
          y={startY + li * lineHeight}
          textAnchor="middle"
          fill="#f2f1da"
          fontSize={fontSize}
          fontWeight="600"
          fontFamily="Flama, sans-serif"
          style={{
            pointerEvents: "none",
            transition: "opacity 0.5s ease",
            opacity: fade ? 0 : 1,
          }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function IconWaveText({
  icon,
  lines,
  x,
  y,
  animationDelay = 0,
  fade = false,
  fontSize = 58,
  iconSize = 60,
  iconGap = 20,
}) {
  const lineHeight = fontSize * 1.3;
  const totalLines = lines.length;
  const blockHeight = totalLines * lineHeight;
  const startY = y - blockHeight / 2 + lineHeight * 0.8;
  const iconX = x - iconSize / 2;
  const iconY = y - iconSize / 2;
  const textX = x + iconSize / 2 + iconGap;
  return (
    <g
      style={{
        animation: `textFloat 3s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
        opacity: fade ? 0 : 1,
        transition: "opacity 0.5s ease",
      }}
    >
      <image
        href={icon}
        x={iconX}
        y={iconY}
        width={iconSize}
        height={iconSize}
      />
      {lines.map((line, li) => (
        <text
          key={li}
          x={textX}
          y={startY + li * lineHeight}
          textAnchor="start"
          fill="#f2f1da"
          fontSize={fontSize}
          fontWeight="600"
          fontFamily="Flama, sans-serif"
          style={{ pointerEvents: "none" }}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function PersistentBackground() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expanded, setExpanded, videoExpanded, setVideoExpanded } = useBlob();
  const { language } = useLanguage();
  const blobs = translations[language].startside.blobs;

  const [quizExpanding, setQuizExpanding] = useState(false);
  const [quizPressed, setQuizPressed] = useState(false);
  const [quizTextVisible, setQuizTextVisible] = useState(true);

  const [videoExpanding, setVideoExpanding] = useState(false);
  const [videoPressed, setVideoPressed] = useState(false);
  const [videoTextVisible, setVideoTextVisible] = useState(true);
  const [videoOnTop, setVideoOnTop] = useState(false);

  useEffect(() => {
    if (videoExpanded) {
      setVideoOnTop(true);
    } else {
      const id = setTimeout(() => setVideoOnTop(false), 1600);
      return () => clearTimeout(id);
    }
  }, [videoExpanded]);

  const onStartPage = location.pathname === "/";
  const anyExpanded = expanded || videoExpanded;

  const [quizIconsVisible, setQuizIconsVisible] = useState(true);

  useEffect(() => {
    if (expanded) {
      setQuizTextVisible(false);
      setQuizIconsVisible(false);
    } else {
      const textId = setTimeout(() => setQuizTextVisible(true), 1300);
      const iconId = setTimeout(() => setQuizIconsVisible(true), 1300);
      return () => {
        clearTimeout(textId);
        clearTimeout(iconId);
      };
    }
  }, [expanded]);

  useEffect(() => {
    if (videoExpanded) {
      setVideoTextVisible(false);
    } else {
      const id = setTimeout(() => setVideoTextVisible(true), 1300);
      return () => clearTimeout(id);
    }
  }, [videoExpanded]);

  const handleQuizTap = () => {
    if (quizExpanding || anyExpanded) return;
    setQuizExpanding(true);
    setExpanded(true);
    setTimeout(() => {
      navigate("/quiz");
      setQuizExpanding(false);
    }, 1600);
  };

  const handleVideoTap = () => {
    if (videoExpanding || anyExpanded) return;
    setVideoExpanding(true);
    setVideoExpanded(true);
    setTimeout(() => {
      navigate("/video/0");
      setVideoExpanding(false);
    }, 1600);
  };

  return (
    <>
      <style>{`
        @keyframes blobPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes blobPulseOuter { 0%, 100% { transform: scale(1.04); } 50% { transform: scale(1.06); } }
        @keyframes letterWave { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes textFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>

      <div
        className="bg-museum-cream"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      <div
        style={{ position: "fixed", bottom: "12px", right: "12px", zIndex: 50 }}
      >
        <FlagButton />
      </div>

      {/* Video blob */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: videoOnTop ? 3 : 2,
          overflow: "hidden",
          pointerEvents: "none",
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
            pointerEvents: "none",
          }}
        >
          <g
            transform="translate(1670 -20) scale(11) rotate(10)"
            onClick={handleVideoTap}
            onPointerDown={() => setVideoPressed(true)}
            onPointerUp={() => setVideoPressed(false)}
            onPointerLeave={() => setVideoPressed(false)}
            style={{
              cursor: onStartPage && !anyExpanded ? "pointer" : "default",
              pointerEvents: onStartPage && !anyExpanded ? "auto" : "none",
            }}
          >
            <path
              d={BLOB_TOP_RIGHT}
              fill="#3d1118"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animation:
                  videoExpanded || videoPressed
                    ? "none"
                    : "blobPulseOuter 3s ease-in-out infinite 1s",
                transition: "transform 1.5s ease-in-out",
                transform: videoExpanded
                  ? `scale(${VIDEO_EXPAND_SCALE * 1.04})`
                  : "scale(1.04)",
              }}
            />
            <path
              d={BLOB_TOP_RIGHT}
              fill="#631d27"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                filter:
                  videoPressed && !videoExpanded
                    ? "brightness(0.75)"
                    : "brightness(1)",
                animation:
                  videoExpanded || videoPressed
                    ? "none"
                    : "blobPulse 3s ease-in-out infinite 1s",
                transition: "transform 1.5s ease-in-out, filter 0.2s ease",
                transform: videoExpanded
                  ? `scale(${VIDEO_EXPAND_SCALE})`
                  : "scale(1)",
              }}
            />
          </g>
          <IconWaveText
            icon={playIcon}
            lines={blobs.video}
            x={1100}
            y={300}
            animationDelay={1}
            fade={!videoTextVisible}
            fontSize={60}
            iconSize={140}
            iconGap={25}
          />
        </svg>
      </div>

      {/* Quiz blob */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: expanded ? 3 : 2,
          overflow: "hidden",
          pointerEvents: "none",
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
            pointerEvents: "none",
          }}
        >
          <g
            transform="translate(350 950) scale(11) rotate(130)"
            onClick={handleQuizTap}
            onPointerDown={() => setQuizPressed(true)}
            onPointerUp={() => setQuizPressed(false)}
            onPointerLeave={() => setQuizPressed(false)}
            style={{
              cursor: onStartPage && !anyExpanded ? "pointer" : "default",
              pointerEvents: onStartPage && !anyExpanded ? "auto" : "none",
            }}
          >
            <path
              d={BLOB_BOTTOM_LEFT}
              fill="#3d1118"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                animation:
                  expanded || quizPressed
                    ? "none"
                    : "blobPulseOuter 3s ease-in-out infinite 2s",
                transition: "transform 1.5s ease-in-out",
                transform: expanded
                  ? `scale(${QUIZ_EXPAND_SCALE * 1.04})`
                  : "scale(1.04)",
              }}
            />
            <path
              d={BLOB_BOTTOM_LEFT}
              fill="#631d27"
              style={{
                transformOrigin: "center",
                transformBox: "fill-box",
                filter:
                  quizPressed && !expanded
                    ? "brightness(0.75)"
                    : "brightness(1)",
                animation:
                  expanded || quizPressed
                    ? "none"
                    : "blobPulse 3s ease-in-out infinite 2s",
                transition: "transform 1.5s ease-in-out, filter 0.2s ease",
                transform: expanded
                  ? `scale(${QUIZ_EXPAND_SCALE})`
                  : "scale(1)",
              }}
            />

            {/* Icons rendered from QUIZ_ICONS config above */}
            {QUIZ_ICONS.map((icon, i) => (
              <image
                key={i}
                href={questionIcon}
                x={icon.x}
                y={icon.y}
                width={icon.size}
                height={icon.size}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: `rotate(${icon.rotation}deg)`,
                  opacity: quizIconsVisible ? icon.opacity : 0,
                  transition: "opacity 0.4s ease",
                }}
              />
            ))}
          </g>
          <WaveText
            lines={blobs.quiz}
            x={520}
            y={870}
            animationDelay={2}
            fade={!quizTextVisible}
          />
        </svg>
      </div>
    </>
  );
}

function AppInner() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <PersistentBackground />
      <Routes>
        <Route path="/" element={null} />
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
