import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useBlob } from "../context/BlobContext";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../translations";
import BackButton from "../components/BackButton";
import CycleWheel from "../components/CycleWheel";

// ─────────────────────────────────────────────────────────────
// Video overlay — fades to black and plays the phase video
// ─────────────────────────────────────────────────────────────
function VideoOverlay({ phase, onBack }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(id);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        background: "#000",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        src={phase.video}
        autoPlay
        controls
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <BackButton onClick={onBack} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Cyklus page
// ─────────────────────────────────────────────────────────────
export default function Cyklus() {
  const navigate = useNavigate();
  const { setCyklusTransitioning } = useBlob();
  const { language } = useLanguage();
  const t = translations[language].cyklus;

  const [visible, setVisible] = useState(false);
  const [activePhase, setActivePhase] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  const handleBackToStart = () => {
    setVisible(false);
    setTimeout(() => {
      navigate("/");
      setTimeout(() => setCyklusTransitioning(true), 50);
    }, 400);
  };

  return (
    <>
      {/* ── Wheel page ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          opacity: visible && !activePhase ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: visible && !activePhase ? "auto" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 60px",
        }}
      >
        <BackButton onClick={handleBackToStart} />

        {/* Wheel — left side */}
        <div
          style={{
            width: "min(125vh, 125vw)",
            height: "min(125vh, 125vw)",
            position: "relative",
            left: "-200px",
            flexShrink: 0,
          }}
        >
          <CycleWheel
            phases={t.phases}
            centerLabel={t.centerLabel}
            onPhaseClick={setActivePhase}
          />
        </div>

        {/* Intro text — right side */}
        <div
          style={{
            flex: 1,
            maxWidth: "400px",
            marginLeft: "-100px",
          }}
        >
          {/* Decorative line */}
          <div
            style={{
              width: "48px",
              height: "4px",
              background: "var(--color-primary)",
              borderRadius: "2px",
              marginBottom: "24px",
            }}
          />
          <p
            style={{
              fontFamily: "Flama, sans-serif",
              fontSize: "2.35rem",
              fontWeight: "400",
              lineHeight: "1.65",
              color: "var(--color-primary)",
              margin: 0,
            }}
          >
            {t.intro}
          </p>
        </div>
      </div>

      {/* ── Video overlay ── */}
      {activePhase && (
        <VideoOverlay phase={activePhase} onBack={() => setActivePhase(null)} />
      )}
    </>
  );
}
