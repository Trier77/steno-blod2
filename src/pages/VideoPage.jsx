import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useBlob } from "../context/BlobContext";
import BackButton from "../components/BackButton";
import mettestest from "../assets/mettestest.mp4";

const VIDEO_SOURCES = [mettestest, mettestest];

function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setVideoExpanded } = useBlob();
  const videoSrc = VIDEO_SOURCES[parseInt(id)] ?? VIDEO_SOURCES[0];

  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Identical to Quiz — fade content in after blob has expanded
  useEffect(() => {
    const id = setTimeout(() => setContentVisible(true), 400);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoaded = () => setDuration(video.duration);
    const handleEnded = () => navigateHome();
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("ended", handleEnded);
    video.play().catch(() => {});
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("ended", handleEnded);
    };
  }, [videoSrc]);

  // Identical to Quiz navigateHome
  const navigateHome = () => {
    setContentVisible(false);
    setVideoExpanded(false);
    setTimeout(() => navigate("/"), 1600);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const formatTime = (t) => {
    if (isNaN(t)) return "0:00";
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
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
  const handlePointerMove = (e) => {
    if (!dragging) return;
    getProgressFromEvent(e);
  };
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

  // Identical to Quiz — transparent bg, zIndex 10, content fades in/out
  return (
    <div
      className="w-screen h-screen overflow-hidden select-none font-flama"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: "absolute",
          inset: 0,
        }}
      >
        <BackButton onClick={navigateHome} />

        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={togglePlay}
            playsInline
          />
        ) : (
          <div className="absolute inset-0 bg-museum-blue/30 flex items-center justify-center">
            <p className="text-primary text-4xl font-semibold opacity-40 tracking-widest uppercase">
              Video {id} — placeholder
            </p>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 px-12 py-8 flex items-center gap-8"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        >
          <button onClick={togglePlay} className="shrink-0">
            {playing ? (
              <svg
                className="w-16 h-16 text-museum-cream"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-16 h-16 text-museum-cream"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div
            ref={progressRef}
            className="relative flex-1 h-2 bg-museum-cream/30 rounded-full cursor-pointer"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
          >
            <div
              className="absolute left-0 top-0 h-full bg-museum-cream rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-museum-cream shadow"
              style={{ left: `calc(${progress * 100}% - 12px)` }}
            />
          </div>
          <span className="text-museum-cream text-3xl shrink-0 font-light">
            -{formatTime(duration - currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
