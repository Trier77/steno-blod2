import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../context/LanguageContext";
import { useBlob } from "../context/BlobContext";
import translations from "../../translations";
import BackButton from "../components/BackButton";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// QUESTION ICONS — importer dine SVG'er fra src/assets/icons her
// og giv dem et navn i ICON_MAP. Navnet er det du bruger i
// translations.js under hvert spørgsmåls "icons" array.
// ─────────────────────────────────────────────────────────────
import scienceIcon from "../assets/icons/forskning.svg";
import calendarIcon from "../assets/icons/kalender.svg";
import kvindeIcon from "../assets/icons/kvinde.svg";
import kopIcon from "../assets/icons/kop.svg";
import tamponIcon from "../assets/icons/tampon.svg";
import blodIcon from "../assets/icons/bloddråber.svg";
import bindIcon from "../assets/icons/bind.svg";

const ICON_MAP = {
  science: scienceIcon,
  calendar: calendarIcon,
  kvinde: kvindeIcon,
  kop: kopIcon,
  tampon: tamponIcon,
  blod: blodIcon,
  bind: bindIcon,
};
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "museum_quiz_scores";
const ATTEMPTS_KEY = "museum_quiz_attempts";

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveScore(score, total) {
  try {
    const existing = loadScores();
    const entry = { score, total, date: Date.now() };
    const updated = [...existing, entry].slice(-5000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [{ score, total, date: Date.now() }];
  }
}

function loadAttemptCount() {
  try {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

function incrementAttempts() {
  try {
    const next = loadAttemptCount() + 1;
    localStorage.setItem(ATTEMPTS_KEY, String(next));
    return next;
  } catch {
    return 1;
  }
}

function calcStats(allScores, myScore, total) {
  const previous = allScores.slice(0, -1);
  const myRatio = myScore / total;
  let percentile = 50;
  if (previous.length > 0) {
    const beaten = previous.filter((s) => s.score / s.total < myRatio).length;
    percentile = Math.round((beaten / previous.length) * 100);
  }
  return { percentile, totalAttempts: loadAttemptCount() };
}

function useCountUp(target, duration = 1200, startDelay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    let timeout;
    timeout = setTimeout(() => {
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [target, duration, startDelay]);
  return value;
}

if (typeof document !== "undefined" && !document.getElementById("quiz-style")) {
  const s = document.createElement("style");
  s.id = "quiz-style";
  s.textContent = `
    @keyframes heartbeat {
      0%   { transform: scale(1); }
      14%  { transform: scale(1.06); }
      28%  { transform: scale(1); }
      42%  { transform: scale(1.04); }
      70%  { transform: scale(1); }
      100% { transform: scale(1); }
    }
    .heartbeat { animation: heartbeat 1.6s ease-in-out infinite; }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(s);
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1], delay },
  }),
};

// Renders one or more decorative icons.
// Accepts either a single icon object or an array of icon objects:
// { icon: "calendar", x: 5, y: 8, size: 70, opacity: 0.12, rotation: -10 }
// x/y are in percent (0-100) of the screen, so they scale with screen size.
function QuestionIcons({ icon }) {
  if (!icon) return null;
  const items = Array.isArray(icon) ? icon : [icon];
  return (
    <>
      {items.map((item, i) => {
        const src = ICON_MAP[item.icon];
        if (!src) return null;
        return (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size ?? 60,
              height: item.size ?? 60,
              opacity: item.opacity ?? 0.15,
              transform: `rotate(${item.rotation ?? 0}deg)`,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </>
  );
}

const SCREEN_INTRO = "intro";
const SCREEN_QUESTION = "question";
const SCREEN_EXPLANATION = "explanation";
const SCREEN_RESULTS = "results";

function Quiz() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { setExpanded } = useBlob();
  const t = translations[language].quiz;

  const [screen, setScreen] = useState(SCREEN_INTRO);
  const [fadeIn, setFadeIn] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState(null);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [quitVisible, setQuitVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const question = t.questions[currentQ];
  const isActiveQuiz =
    screen === SCREEN_QUESTION || screen === SCREEN_EXPLANATION;

  useEffect(() => {
    const id = setTimeout(() => setContentVisible(true), 400);
    return () => clearTimeout(id);
  }, []);

  const transitionTo = (nextScreen) => {
    setFadeIn(false);
    setTimeout(() => {
      setScreen(nextScreen);
      setFadeIn(true);
    }, 300);
  };

  const navigateHome = () => {
    setContentVisible(false);
    setExpanded(false);
    setTimeout(() => navigate("/"), 1600);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    const correct = index === question.correct;
    setSelectedAnswer(index);
    setWasCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setTimeout(() => setShowCorrect(true), 800);
    setTimeout(() => transitionTo(SCREEN_EXPLANATION), 1600);
  };

  const handleNext = () => {
    const nextQ = currentQ + 1;
    setSelectedAnswer(null);
    setShowCorrect(false);
    setWasCorrect(null);
    if (nextQ >= t.questions.length) {
      incrementAttempts();
      const allScores = saveScore(score, t.questions.length);
      const computed = calcStats(allScores, score, t.questions.length);
      setStats(computed);
      transitionTo(SCREEN_RESULTS);
    } else {
      setCurrentQ(nextQ);
      transitionTo(SCREEN_QUESTION);
    }
  };

  const handlePlayAgain = () => {
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setWasCorrect(null);
    setShowCorrect(false);
    setStats(null);
    transitionTo(SCREEN_QUESTION);
  };

  const handleBackAttempt = () => {
    if (isActiveQuiz) {
      setShowQuitDialog(true);
      setTimeout(() => setQuitVisible(true), 10);
    } else {
      navigateHome();
    }
  };

  const handleConfirmQuit = () => {
    setQuitVisible(false);
    setTimeout(() => {
      setShowQuitDialog(false);
      navigateHome();
    }, 300);
  };

  const handleCancelQuit = () => {
    setQuitVisible(false);
    setTimeout(() => setShowQuitDialog(false), 300);
  };

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden select-none font-flama"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        backgroundColor: "transparent",
      }}
    >
      {showQuitDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleCancelQuit}
          style={{
            backgroundColor: `rgba(0,0,0,${quitVisible ? 0.5 : 0})`,
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            className="bg-museum-cream rounded-3xl p-16 max-w-2xl w-full mx-8 flex flex-col items-center gap-8"
            onClick={(e) => e.stopPropagation()}
            style={{
              opacity: quitVisible ? 1 : 0,
              transform: quitVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <h3 className="text-primary text-4xl font-semibold text-center">
              {t.quitTitle}
            </h3>
            <p className="text-primary/70 text-2xl text-center leading-relaxed font-light">
              {t.quitBody}
            </p>
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={handleConfirmQuit}
                className="w-full bg-primary text-museum-cream font-semibold text-2xl rounded-full py-5"
              >
                {t.quitConfirm}
              </button>
              <button
                onClick={handleCancelQuit}
                className="w-full text-museum-cream font-semibold text-2xl rounded-full py-5"
                style={{ backgroundColor: "#631d27" }}
              >
                {t.quitCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BackButton er udenfor fading-div så den altid er synlig */}
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <BackButton onClick={handleBackAttempt} />
      </div>

      <div
        className="flex flex-col flex-1 px-32 py-16"
        style={{
          opacity: contentVisible && fadeIn ? 1 : 0,
          transform:
            contentVisible && fadeIn ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* INTRO */}
        {screen === SCREEN_INTRO && (
          <div className="flex flex-col items-center justify-between h-full px-16 pt-8 pb-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8">
              <motion.h1
                className="text-museum-cream font-semibold text-center"
                style={{ fontSize: "6rem", lineHeight: 1.1 }}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
              >
                {t.title}
              </motion.h1>
              <motion.p
                className="text-museum-cream/80 text-3xl text-center leading-relaxed font-light max-w-3xl"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.25}
              >
                {t.intro}
              </motion.p>
              <motion.div
                className="flex items-center gap-4"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.4}
              >
                <span className="text-museum-cream/60 text-2xl font-light">
                  {t.questions.length} {t.introQuestionCount} · {t.introReady}
                </span>
              </motion.div>
            </div>
            <motion.button
              onClick={() => transitionTo(SCREEN_QUESTION)}
              className="bg-museum-cream text-primary font-semibold text-3xl rounded-full px-24 py-6 mb-4 hover:opacity-90 transition-opacity duration-200"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
            >
              {t.startBtn}
            </motion.button>
          </div>
        )}

        {/* QUESTION */}
        {screen === SCREEN_QUESTION && (
          <div
            className="flex flex-col h-full"
            style={{ position: "relative" }}
          >
            <QuestionIcons icon={question.icon} />
            <div className="flex-1 flex items-center justify-center px-16">
              <motion.h2
                className="text-museum-cream text-6xl font-semibold text-center leading-snug"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1}
              >
                {question.question}
              </motion.h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {question.options.map((option, i) => {
                const getOptionStyle = () => {
                  if (selectedAnswer === null)
                    return "bg-museum-cream text-primary hover:opacity-90";
                  if (!showCorrect) {
                    if (i === selectedAnswer)
                      return "bg-primary text-museum-cream";
                    return "bg-museum-cream text-primary opacity-40";
                  }
                  if (i === question.correct) return "bg-green-600 text-white";
                  if (i === selectedAnswer && !wasCorrect)
                    return "bg-primary text-museum-cream opacity-80";
                  return "bg-museum-cream text-primary opacity-30";
                };
                return (
                  <motion.button
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={0.2 + i * 0.1}
                    onClick={() => handleAnswer(i)}
                    className={`rounded-3xl px-8 py-8 font-semibold text-3xl text-center transition-all duration-500 ${getOptionStyle()}`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
            >
              {t.questions.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full bg-museum-cream transition-all duration-300 ${
                    i === currentQ
                      ? "w-5 h-5 opacity-100"
                      : "w-3 h-3 opacity-30"
                  }`}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* EXPLANATION */}
        {screen === SCREEN_EXPLANATION && (
          <div
            className="flex flex-col items-center justify-between h-full"
            style={{ position: "relative" }}
          >
            <QuestionIcons icon={question.explanationIcon} />
            <div className="flex-1 flex flex-col items-center justify-center gap-10 px-16">
              <span className="text-museum-cream text-6xl font-semibold">
                {wasCorrect ? t.correctLabel : t.wrongLabel}
              </span>
              <p className="text-museum-cream text-3xl text-center leading-relaxed font-light">
                {question.explanation}
              </p>
            </div>
            <button
              onClick={handleNext}
              className="bg-museum-cream text-primary font-semibold text-4xl rounded-full px-16 py-5 mb-20 transition-opacity duration-200"
            >
              {currentQ + 1 >= t.questions.length ? t.resultsTitle : t.nextBtn}
            </button>
          </div>
        )}

        {/* RESULTS */}
        {screen === SCREEN_RESULTS && stats && (
          <ResultsScreen
            score={score}
            total={t.questions.length}
            stats={stats}
            t={t}
            onPlayAgain={handlePlayAgain}
            onHome={navigateHome}
          />
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ score, total, stats, t, onPlayAgain, onHome }) {
  const animatedScore = useCountUp(score, 900, 200);
  const animatedPct = useCountUp(stats.percentile, 1400, 700);
  const [showPercentile, setShowPercentile] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPercentile(true), 900);
    const t2 = setTimeout(() => setShowButtons(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-between h-full px-16 pt-12 pb-10">
      <div className="flex gap-10 w-full flex-1 mb-10">
        <div
          className="flex-1 rounded-3xl flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: "rgba(242,241,218,0.15)" }}
        >
          <h2
            className="text-museum-cream text-4xl font-semibold"
            style={{ animation: "fadeSlideUp 0.6s ease forwards" }}
          >
            {t.resultsHeading}
          </h2>
          <p
            className="text-museum-cream font-semibold leading-none"
            style={{
              fontSize: "8rem",
              animation: "fadeSlideUp 0.6s ease 100ms forwards",
              opacity: 0,
            }}
          >
            {animatedScore}
            <span className="opacity-30" style={{ fontSize: "4rem" }}>
              /{total}
            </span>
          </p>
        </div>

        <div
          className="flex-1 rounded-3xl flex flex-col items-center justify-center gap-4"
          style={{
            backgroundColor: "rgba(242,241,218,0.15)",
            opacity: showPercentile ? 1 : 0,
            transform: showPercentile ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="text-museum-cream text-3xl font-light text-center">
            {t.resultsBetterThan}
          </p>
          <p
            className={`text-museum-cream font-semibold leading-none${showPercentile ? " heartbeat" : ""}`}
            style={{ fontSize: "8rem" }}
          >
            {animatedPct}%
          </p>
          <p className="text-museum-cream text-3xl font-light text-center">
            {t.resultsOfVisitors}
          </p>
          <p className="text-museum-cream text-center text-lg mt-1">
            {t.resultsBasedOn}{" "}
            <span className="font-semibold text-2xl">
              {stats.totalAttempts}
            </span>{" "}
            {t.resultsAttempts}
          </p>
        </div>
      </div>

      <div
        className="flex flex-col items-center gap-5 w-1/2"
        style={{
          opacity: showButtons ? 1 : 0,
          transform: showButtons ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <button
          onClick={onPlayAgain}
          className="w-full bg-museum-cream/20 text-museum-cream border-2 border-museum-cream/40 font-semibold text-4xl rounded-full py-10 transition-opacity duration-200"
        >
          {t.playAgainBtn}
        </button>
        <button
          onClick={onHome}
          className="w-full bg-museum-cream text-primary font-semibold text-4xl rounded-full py-10 border-5 border-primary transition-all duration-200"
        >
          {t.backBtn}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
