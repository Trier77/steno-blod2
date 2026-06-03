import { Route, Routes, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import { BlobProvider, useBlob } from "./context/BlobContext";
import Quiz from "./pages/Quiz";
import VideoPage from "./pages/VideoPage";
import FlagButton from "./components/FlagButton";
import "./App.css";

const BLOB_TOP_LEFT = `
  M40.6,-59.2C48.1,-58.4,46.5,-39.5,52.3,-24.6C58,-9.6,71.1,1.2,75.2,14.7C79.4,28.2,74.6,44.3,62.2,48.1C49.9,51.9,30,43.2,14.1,47.7C-1.8,52.2,-13.7,69.7,-23.1,70.7C-32.5,71.6,-39.5,55.9,-39.8,42C-40.1,28.1,-33.8,16,-32.6,6.4C-31.4,-3.3,-35.3,-10.6,-37.8,-22.3C-40.3,-34,-41.5,-50.2,-34.9,-51.4C-28.4,-52.7,-14.2,-39,1.2,-40.8C16.6,-42.6,33.2,-60,40.6,-59.2Z
`;

const BLOB_TOP_RIGHT = `
  M20.2,-27.1C33.6,-22.9,57,-29.8,58.3,-26.7C59.6,-23.6,38.7,-10.5,32.7,2C26.7,14.5,35.5,26.5,36.3,38.7C37,50.9,29.6,63.3,19.9,64.9C10.2,66.4,-1.9,57,-17.9,55C-34,53.1,-54,58.6,-63,52.3C-72.1,46,-70.1,27.9,-60.3,16.1C-50.4,4.3,-32.6,-1.2,-28.7,-14.5C-24.8,-27.7,-34.7,-48.6,-32.3,-57.9C-29.8,-67.2,-14.9,-64.8,-5.7,-55.8C3.4,-46.9,6.8,-31.4,20.2,-27.1Z
`;

const BLOB_BOTTOM_LEFT = `
  M32.7,-50.8C45.8,-42.5,62,-39.1,65.1,-30.3C68.2,-21.5,58.1,-7.3,51.7,4.4C45.2,16,42.3,25.1,36.8,32.6C31.4,40,23.3,45.8,14.3,48.2C5.4,50.7,-4.5,49.6,-13.5,46.7C-22.5,43.7,-30.7,38.7,-32.9,31.3C-35.2,23.8,-31.4,13.9,-34.9,3.7C-38.5,-6.5,-49.4,-17,-52.5,-29.6C-55.5,-42.2,-50.8,-57,-40.7,-66.6C-30.7,-76.2,-15.4,-80.7,-2.8,-76.4C9.8,-72.1,19.7,-59,32.7,-50.8Z
`;

const EXPAND_SCALE = 50 / 8;

function BlobButton({
  path,
  label,
  onClick,
  svgTransform,
  animationDelay = "0s",
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <g
      transform={svgTransform}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={label}
    >
      <path
        d={path}
        fill="#3d1118"
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          animation: pressed
            ? "none"
            : `blobPulseOuter 3s ease-in-out infinite ${animationDelay}`,
        }}
      />
      <path
        d={path}
        fill="#631d27"
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          transition: "filter 0.2s ease",
          filter: pressed ? "brightness(0.75)" : "brightness(1)",
          animation: pressed
            ? "none"
            : `blobPulse 3s ease-in-out infinite ${animationDelay}`,
        }}
      />
    </g>
  );
}

function WaveText({ label, x, y, animationDelay = 0, fade = false }) {
  const CHAR_WIDTH = 60;
  const chars = label.split("");
  const totalWidth = chars.length * CHAR_WIDTH;
  const startX = x - totalWidth / 2;
  return (
    <>
      {chars.map((char, i) => (
        <text
          key={i}
          x={startX + i * CHAR_WIDTH + CHAR_WIDTH / 2}
          y={y}
          textAnchor="middle"
          fill="#f2f1da"
          fontSize="82"
          fontWeight="600"
          fontFamily="Flama, sans-serif"
          style={{
            pointerEvents: "none",
            animation: `letterWave 3s ease-in-out infinite`,
            animationDelay: `${animationDelay + i * 0.16}s`,
            transition: "opacity 0.5s ease",
            opacity: fade ? 0 : 1,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </text>
      ))}
    </>
  );
}

function PersistentBackground() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expanded, setExpanded } = useBlob();
  const [expanding, setExpanding] = useState(false);
  const [quizPressed, setQuizPressed] = useState(false);
  // Controls when QUIZ label fades in after shrink
  const [quizTextVisible, setQuizTextVisible] = useState(true);

  useEffect(() => {
    if (expanded) {
      setQuizTextVisible(false);
    } else {
      // Wait for shrink animation to nearly finish before fading text in
      const id = setTimeout(() => setQuizTextVisible(true), 1300);
      return () => clearTimeout(id);
    }
  }, [expanded]);

  // Only show start screen interactive elements on "/"
  const onStartPage = location.pathname === "/";

  const handleQuizTap = () => {
    if (expanding || expanded) return;
    setExpanding(true);
    setExpanded(true);
    setTimeout(() => {
      navigate("/quiz");
      setExpanding(false);
    }, 1600);
  };

  return (
    <>
      <style>{`
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes blobPulseOuter {
          0%, 100% { transform: scale(1.04); }
          50% { transform: scale(1.06); }
        }
        @keyframes letterWave {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Cream background */}
      <div
        className="bg-museum-cream"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      />

      {/* Cyklus + Video blobs — always in DOM */}
      <svg
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          display: "block",
          overflow: "visible",
          // Only interactive on start page and when not expanded
          pointerEvents: onStartPage && !expanded ? "auto" : "none",
        }}
      >
        <BlobButton
          path={BLOB_TOP_LEFT}
          label="Cyklus"
          onClick={() => navigate("/cyklusser")}
          svgTransform="translate(240 0) scale(9) rotate(375)"
          animationDelay="0s"
        />
        <BlobButton
          path={BLOB_TOP_RIGHT}
          label="Video"
          onClick={() => navigate("/video/forsker")}
          svgTransform="translate(1770 130) scale(9) rotate(10)"
          animationDelay="1s"
        />
        <WaveText
          label="Cyklus"
          x={400}
          y={250}
          animationDelay={0}
          fade={expanded}
        />
        <WaveText
          label="Video"
          x={1600}
          y={350}
          animationDelay={1}
          fade={expanded}
        />
      </svg>

      {/* Language button — always fixed bottom right, always clickable */}
      <div
        style={{ position: "fixed", bottom: "12px", right: "12px", zIndex: 50 }}
      >
        <FlagButton />
      </div>

      {/* Quiz blob — always in DOM, scales up/down, clickable on start page */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          overflow: "hidden",
          // Only intercept clicks on start page when not yet expanded
          pointerEvents: onStartPage && !expanded ? "auto" : "none",
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
          <g
            transform="translate(600 1150) scale(8) rotate(110)"
            onClick={handleQuizTap}
            onPointerDown={() => setQuizPressed(true)}
            onPointerUp={() => setQuizPressed(false)}
            onPointerLeave={() => setQuizPressed(false)}
            style={{ cursor: onStartPage && !expanded ? "pointer" : "default" }}
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
                  ? `scale(${EXPAND_SCALE * 1.04})`
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
                transform: expanded ? `scale(${EXPAND_SCALE})` : "scale(1)",
              }}
            />
          </g>
          {/* QUIZ label sits above the blob, fades with expansion */}
          <WaveText
            label="QUIZ"
            x={720}
            y={1010}
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
