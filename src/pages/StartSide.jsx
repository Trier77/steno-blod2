import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../translations";
import FlagButton from "../components/FlagButton";
import ConfirmDialog from "../components/ConfirmDialogue";

// Organic wavy blobs anchored to each corner, no overlap, clear gaps between them.
// SVG space: 1920 × 1080. Each blob bleeds off its corner edge.

const BLOB_TOP_LEFT = `
  M 0,0
  C 70,-70 240,-60 300,-40
  C 360,-20 380,40 420,65
  C 465,95 530,90 570,125
  C 610,160 600,215 560,240
  C 520,265 460,250 420,275
  C 370,305 360,345 300,360
  C 240,375 160,345 0,310
  L 0,0
  Z
`;

const BLOB_TOP_RIGHT = `
  M 1920,0
  C 1850,-70 1680,-60 1620,-40
  C 1560,-20 1540,40 1500,65
  C 1455,95 1390,90 1350,125
  C 1310,160 1320,215 1360,240
  C 1400,265 1460,250 1500,275
  C 1550,305 1560,345 1620,360
  C 1680,375 1760,345 1920,310
  L 1920,0
  Z
`;

const BLOB_BOTTOM_LEFT = `
  M 0,1080
  C 70,1150 240,1140 300,1120
  C 360,1100 380,1040 420,1015
  C 465,985 530,990 570,955
  C 610,920 600,865 560,840
  C 520,815 460,830 420,805
  C 370,775 360,735 300,720
  C 240,705 160,735 0,770
  L 0,1080
  Z
`;

const LABEL = {
  topLeft: { x: 280, y: 380 },
  topRight: { x: 1640, y: 380 },
  bottomLeft: { x: 290, y: 720 },
};

function BlobButton({ path, labelX, labelY, label, sublabel, onClick }) {
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
          labelX={LABEL.topLeft.x}
          labelY={LABEL.topLeft.y}
          label={t.btn1?.label ?? "Cyklusserne"}
          onClick={() => navigate("/cyklusser")}
        />
        <BlobButton
          path={BLOB_TOP_RIGHT}
          labelX={LABEL.topRight.x}
          labelY={LABEL.topRight.y}
          label={t.btn2?.label ?? "Forskerens ord"}
          onClick={() => navigate("/video/forsker")}
        />
        <BlobButton
          path={BLOB_BOTTOM_LEFT}
          labelX={LABEL.bottomLeft.x}
          labelY={LABEL.bottomLeft.y}
          label={t.btn3?.label ?? "Test din viden"}
          onClick={openQuizIntro}
        />

        {/* Language button — bottom right */}
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
