import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
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

        {/* Wheel — slides in from the left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -40 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          style={{
            width: "min(125vh, 125vw)",
            height: "min(125vh, 125vw)",
            position: "relative",
            left: "-60px",
            flexShrink: 0,
          }}
        >
          <CycleWheel
            phases={t.phases}
            centerLabel={t.centerLabel}
            centerHint={t.centerHint}
            onPhaseClick={setActivePhase}
          />
        </motion.div>

        {/* Intro text panel — slides in from the right */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 80 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
          style={{
            flex: 1,
            marginLeft: "-100px",
            marginRight: "-60px",
            background: "var(--color-primary)",
            padding: "40px",
            borderRadius: "12px 0 0 12px",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "480px" }}>
            {/* Decorative line — grows in */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: visible ? "48px" : 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
              style={{
                height: "4px",
                background: "var(--color-museum-cream)",
                borderRadius: "2px",
                marginBottom: "24px",
              }}
            />

            {/* Main intro text — fades up */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
              style={{
                fontFamily: "Flama, sans-serif",
                fontSize: "3rem",
                fontWeight: "400",
                lineHeight: "1.65",
                color: "var(--color-museum-cream)",
                margin: 0,
                marginBottom: "1.5rem",
              }}
            >
              {t.intro}
            </motion.p>

            {/* Action text — fades up slightly after */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: visible ? 0.7 : 0, y: visible ? 0 : 16 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
              style={{
                fontFamily: "Flama, sans-serif",
                fontSize: "1.9rem",
                fontWeight: "400",
                lineHeight: "1.65",
                color: "var(--color-museum-cream)",
                margin: 0,
              }}
            >
              {t.introAction}
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* ── Video overlay ── */}
      {activePhase && (
        <VideoOverlay phase={activePhase} onBack={() => setActivePhase(null)} />
      )}
    </>
  );
}
