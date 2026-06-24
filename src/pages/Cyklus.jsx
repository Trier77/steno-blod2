import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useBlob } from "../context/BlobContext";
import BackButton from "../components/BackButton";

export default function Cyklus() {
  const navigate = useNavigate();
  const { setCyklusTransitioning } = useBlob();

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(id);
  }, []);

  const handleBack = () => {
    setVisible(false);
    setTimeout(() => {
      // Navigate first so App.jsx is mounted on "/"...
      navigate("/");
      // ...then signal on the next tick so the useEffect in
      // PersistentBackground sees onStartPage=true at the same time
      setTimeout(() => setCyklusTransitioning(true), 50);
    }, 400);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <BackButton onClick={handleBack} />

      {/* ── Your cyklus page content goes here ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Flama, sans-serif",
            fontSize: "2rem",
            color: "#3d1118",
            opacity: 0.35,
          }}
        >
          Cyklus-siden — indhold kommer snart
        </p>
      </div>
    </div>
  );
}
