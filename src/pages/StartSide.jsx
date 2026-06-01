import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../translations";
import FlagButton from "../components/FlagButton";
import ConfirmDialog from "../components/ConfirmDialogue";

const BLOB_TOP_LEFT = `
  M40.6,-59.2C48.1,-58.4,46.5,-39.5,52.3,-24.6C58,-9.6,71.1,1.2,75.2,14.7C79.4,28.2,74.6,44.3,62.2,48.1C49.9,51.9,30,43.2,14.1,47.7C-1.8,52.2,-13.7,69.7,-23.1,70.7C-32.5,71.6,-39.5,55.9,-39.8,42C-40.1,28.1,-33.8,16,-32.6,6.4C-31.4,-3.3,-35.3,-10.6,-37.8,-22.3C-40.3,-34,-41.5,-50.2,-34.9,-51.4C-28.4,-52.7,-14.2,-39,1.2,-40.8C16.6,-42.6,33.2,-60,40.6,-59.2Z
`;

const BLOB_TOP_RIGHT = `
  M26.5,-52C28.4,-39.9,20.1,-22.7,17,-12.7C14,-2.7,16.1,-0.1,24.4,9.7C32.7,19.6,47.2,36.5,48.2,50C49.3,63.5,36.9,73.5,22.9,77.4C8.8,81.3,-6.8,79,-17.4,70.7C-28,62.4,-33.6,48.2,-42.8,37.2C-52.1,26.3,-65.2,18.8,-71.2,7.4C-77.3,-4,-76.5,-19.3,-65.9,-24.9C-55.3,-30.5,-34.9,-26.5,-22.3,-33.8C-9.6,-41.1,-4.8,-59.7,3.7,-65.5C12.2,-71.2,24.5,-64.2,26.5,-52Z
`;

const BLOB_BOTTOM_LEFT = `
  M32.7,-50.8C45.8,-42.5,62,-39.1,65.1,-30.3C68.2,-21.5,58.1,-7.3,51.7,4.4C45.2,16,42.3,25.1,36.8,32.6C31.4,40,23.3,45.8,14.3,48.2C5.4,50.7,-4.5,49.6,-13.5,46.7C-22.5,43.7,-30.7,38.7,-32.9,31.3C-35.2,23.8,-31.4,13.9,-34.9,3.7C-38.5,-6.5,-49.4,-17,-52.5,-29.6C-55.5,-42.2,-50.8,-57,-40.7,-66.6C-30.7,-76.2,-15.4,-80.7,-2.8,-76.4C9.8,-72.1,19.7,-59,32.7,-50.8Z
`;

function BlobButton({ path, label, onClick, transform }) {
  const [pressed, setPressed] = useState(false);
  return (
    <g
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
        fill="#631d27"
        transform={transform}
        style={{
          transition: "filter 0.2s ease",
          filter: pressed ? "brightness(0.75)" : "brightness(1)",
        }}
      />
    </g>
  );
}

function StartSide() {
  const navigate = useNavigate();
  const { language, visible } = useLanguage();
  const t = translations[language].startside;
  const tQuiz = translations[language].quiz;

  const [showQuizIntro, setShowQuizIntro] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const openQuizIntro = () => {
    setShowQuizIntro(true);
    setTimeout(() => setDialogVisible(true), 10);
  };
  const closeQuizIntro = () => {
    setDialogVisible(false);
    setTimeout(() => setShowQuizIntro(false), 300);
  };
  const handleStartQuiz = () => {
    setDialogVisible(false);
    setTimeout(() => navigate("/quiz"), 300);
  };

  return (
    <div
      className={`w-screen h-screen bg-museum-cream overflow-hidden select-none font-flama transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {showQuizIntro && (
        <ConfirmDialog
          visible={dialogVisible}
          title={tQuiz.title}
          body={tQuiz.intro}
          confirmLabel={tQuiz.startBtn}
          cancelLabel={tQuiz.quitCancel}
          onConfirm={handleStartQuiz}
          onCancel={closeQuizIntro}
        />
      )}

      <svg
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ display: "block" }}
      >
        <BlobButton
          path={BLOB_TOP_LEFT}
          label={t.btn1?.label ?? "Cyklusserne"}
          onClick={() => navigate("/cyklusser")}
          transform="translate(240 0) scale(8) rotate(375)"
        />
        <BlobButton
          path={BLOB_TOP_RIGHT}
          label={t.btn2?.label ?? "Forskerens ord"}
          onClick={() => navigate("/video/forsker")}
          transform="translate(1600 0) scale(8) rotate(300)"
        />
        <BlobButton
          path={BLOB_BOTTOM_LEFT}
          label={t.btn3?.label ?? "Test din viden"}
          onClick={openQuizIntro}
          transform="translate(280 1000) scale(7) rotate(120)"
        />

        {/* Language button — bottom right, no blob */}
        <foreignObject x="1760" y="990" width="150" height="85">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              width: "100%",
              height: "100%",
              paddingRight: "12px",
              paddingBottom: "8px",
            }}
          >
            <FlagButton />
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export default StartSide;
