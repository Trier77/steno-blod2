import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useBlob } from "../context/BlobContext";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../translations";
import BackButton from "../components/BackButton";
import CycleWheel from "../components/CycleWheel";
import VideoControls from "../components/VideoControls";
import front from "../assets/front.gif"

// ─────────────────────────────────────────────────────────────
// "What's next" overlay — shown when a video finishes playing.
// Offers: play next phase, or go back to the wheel.
// Tapping outside the card also returns to the wheel.
// ─────────────────────────────────────────────────────────────
function VideoEndOverlay({ t, hasNext, onNext, onBackToWheel }) {


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onBackToWheel}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-museum-cream)",
          borderRadius: "16px",
          padding: "48px",
          maxWidth: "520px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Flama, sans-serif",
            fontSize: "1.6rem",
            fontWeight: "500",
            color: "var(--color-primary)",
            lineHeight: "1.5",
            margin: 0,
            marginBottom: "32px",
          }}
        >
          {t.videoEndQuestion}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {hasNext && (
            <button
              onClick={onNext}
              style={{
                fontFamily: "Flama, sans-serif",
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "var(--color-museum-cream)",
                background: "var(--color-primary)",
                border: "none",
                borderRadius: "999px",
                padding: "16px 32px",
                cursor: "pointer",
              }}
            >
              {t.videoEndNext}
            </button>
          )}
          <button
            onClick={onBackToWheel}
            style={{
              fontFamily: "Flama, sans-serif",
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "var(--color-primary)",
              background: "transparent",
              border: "2px solid var(--color-primary)",
              borderRadius: "999px",
              padding: "14px 32px",
              cursor: "pointer",
            }}
          >
            {t.videoEndBack}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Video overlay — fades to black, plays the phase video,
// then shows the "what's next" overlay when it ends.
// ─────────────────────────────────────────────────────────────
function VideoOverlay({ phase, phases, t, onBack, onPlayPhase }) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(id);
  }, []);

  // Reset the end-overlay state whenever the phase changes
  // (e.g. user taps "next phase")
  useEffect(() => {
    setShowEndOverlay(false);
  }, [phase]);

  const currentIndex = phases.findIndex((p) => p.id === phase.id);
  const isLastPhase = currentIndex === phases.length - 1;
  const nextPhase = !isLastPhase ? phases[currentIndex + 1] : null;

  const handleVideoEnded = () => {
    if (isLastPhase) {
      // Last phase finished — just close and return to the wheel
      onBack();
    } else {
      setShowEndOverlay(true);
    }
  };

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
        key={phase.id}
        src={phase.video}
        autoPlay
        // controls
        onEnded={handleVideoEnded}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {/* Tilføj VideoControls */}
      <VideoControls videoRef={videoRef} />
      
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <BackButton onClick={onBack} />
      </div>

      <AnimatePresence>
        {showEndOverlay && (
          <VideoEndOverlay
            t={t}
            hasNext={!!nextPhase}
            onNext={() => nextPhase && onPlayPhase(nextPhase)}
            onBackToWheel={onBack}
          />
        )}
      </AnimatePresence>
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
            position: "relative", // ← tilføj denne
            overflow: "hidden",   // ← så videoen ikke stikker ud over hjørnerne
          }}
        >

            {/* Baggrundsvideo — kører i loop under teksten */}
            <img
              src={front}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                zIndex: 0,
                opacity: 1,
              }}
            />

            <div style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "480px",
               // samme farve som primary men gennemsigtig
              backdropFilter: "blur(12px)",
              // border: "5px solid  rgba(255, 255, 255, 1)",
              borderRadius: "12px",
              
            }}>
  

          
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
        <VideoOverlay
          phase={activePhase}
          phases={t.phases}
          t={t}
          onBack={() => setActivePhase(null)}
          onPlayPhase={setActivePhase}
        />
      )}
    </>
  );
}
