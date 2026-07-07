import { useRef, useState, useEffect } from "react";

// Genbrugelig videokontrol-komponent med play/pause, progressionsbar og resterende tid.
// Props:
//   videoRef     — ref til video-elementet der skal styres
//   onTogglePlay — kaldes når play/pause skifter

export default function VideoControls({ videoRef }) {
  const progressRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setCurrentTime(video.currentTime);
    const onLoad = () => setDuration(video.duration);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onLoad);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onLoad);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  // Skjuler kontroller efter 1 sekund, genstartes ved interaktion
  const revealControls = () => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  useEffect(() => {
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 1000);
    return () => clearTimeout(controlsTimerRef.current);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); } else { video.pause(); }
  };

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getProgressFromEvent = (e) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setDragging(true);
    getProgressFromEvent(e);
  };
  const handlePointerMove = (e) => { if (!dragging) return; getProgressFromEvent(e); };
  const handlePointerUp = () => setDragging(false);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.addEventListener("touchstart", handlePointerDown, { passive: false });
    bar.addEventListener("touchmove", handlePointerMove, { passive: false });
    bar.addEventListener("touchend", handlePointerUp);
    return () => {
      bar.removeEventListener("touchstart", handlePointerDown);
      bar.removeEventListener("touchmove", handlePointerMove);
      bar.removeEventListener("touchend", handlePointerUp);
    };
  }, [dragging]);

  const progress = duration ? currentTime / duration : 0;

  return (
    // Wrapper der fanger klik på skærmen og viser kontrollerne igen
    <div
      style={{ position: "absolute", inset: 0, zIndex: 25 }}
      onClick={revealControls}
    >
      <div
        className="absolute bottom-0 left-0 right-0 px-12 pb-18 flex items-center gap-8"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          opacity: showControls ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        {/* Play/pause knap */}
        <button onClick={togglePlay} className="shrink-0">
          {playing ? (
            <svg className="w-16 h-16 text-museum-cream" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-museum-cream" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Progressionsbar */}
        <div
          ref={progressRef}
          className="relative flex-1 h-3 bg-museum-cream/30 rounded-full cursor-pointer"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          <div
            className="absolute left-0 top-0 h-full bg-museum-cream rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Håndtag */}
          <div
            style={{
                left: `calc(${progress * 100}% - 28px)`,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                padding: "20px",
            }}
            onMouseDown={handlePointerDown}
            onTouchStart={handlePointerDown}
          >
            <div className="w-10 h-10 rounded-full bg-museum-cream shadow" />
          </div>
        </div>

        {/* Resterende tid */}
        <span className="text-museum-cream text-3xl shrink-0 font-light">
          -{formatTime(duration - currentTime)}
        </span>
      </div>
    </div>
  );
}