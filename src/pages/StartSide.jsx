import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import translations from "../../translations";
import FlagButton from "../components/FlagButton";
import ConfirmDialog from "../components/ConfirmDialogue";

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
      className={`w-screen h-screen bg-museum-cream flex flex-col overflow-hidden select-none font-flama transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
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

      {/* Header */}
      <header className="flex items-center justify-between px-20 pt-14 pb-10">
        <div>
          <p className="text-primary tracking-[0.3em] uppercase text-sm font-light">
            {t.museumName}
          </p>
          <h1 className="text-primary text-5xl font-semibold leading-tight mt-1">
            {t.exhibitionTitle}
          </h1>
        </div>
        <FlagButton />
      </header>

      {/* Main content */}
      <main className="flex flex-1 gap-10 px-20 pb-12">
        {/* Video 1 */}
        <button
          onClick={() => navigate("/video/1")}
          className="flex-1 relative rounded-2xl overflow-hidden bg-museum-blue group cursor-pointer border-2 border-transparent hover:border-museum-crimson transition-all duration-300"
        >
          {/* <img src="/thumbnails/video1.jpg" className="absolute inset-0 w-full h-full object-cover" /> */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-museum-cream/20 border-2 border-museum-cream/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-museum-cream/30 transition-all duration-300">
              <svg
                className="w-10 h-10 text-museum-cream ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
            <p className="tracking-widest uppercase text-xs text-museum-cream/70 mb-1 font-light">
              {t.video1.label}
            </p>
            <h2 className="text-museum-cream text-2xl font-semibold">
              {t.video1.title}
            </h2>
          </div>
        </button>

        {/* Video 2 */}
        <button
          onClick={() => navigate("/video/2")}
          className="flex-1 relative rounded-2xl overflow-hidden bg-museum-blue group cursor-pointer border-2 border-transparent hover:border-museum-crimson transition-all duration-300"
        >
          {/* <img src="/thumbnails/video2.jpg" className="absolute inset-0 w-full h-full object-cover" /> */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-museum-cream/20 border-2 border-museum-cream/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-museum-cream/30 transition-all duration-300">
              <svg
                className="w-10 h-10 text-museum-cream ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
            <p className="tracking-widest uppercase text-xs text-museum-cream/70 mb-1 font-light">
              {t.video2.label}
            </p>
            <h2 className="text-museum-cream text-2xl font-semibold">
              {t.video2.title}
            </h2>
          </div>
        </button>

        {/* Quiz */}
        <button
          onClick={openQuizIntro}
          className="w-80 rounded-2xl bg-museum-crimson group cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-6 p-10"
        >
          <div className="w-24 h-24 rounded-full border-2 border-museum-cream/40 flex items-center justify-center group-hover:border-museum-cream transition-all duration-300">
            <svg
              className="w-10 h-10 text-museum-cream"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="tracking-widest uppercase text-xs text-museum-cream/60 mb-2 font-light">
              {t.quiz.label}
            </p>
            <h2 className="text-museum-cream text-3xl font-semibold leading-tight">
              {t.quiz.title}
            </h2>
            <p className="text-museum-cream/70 text-sm mt-3 leading-relaxed font-light">
              {t.quiz.body}
            </p>
          </div>
          <div className="mt-2 px-6 py-3 border border-museum-cream/30 rounded-full group-hover:bg-museum-cream/10 transition-all duration-300">
            <span className="text-museum-cream text-sm tracking-widest uppercase">
              {t.quiz.btn} →
            </span>
          </div>
        </button>
      </main>
    </div>
  );
}

export default StartSide;
