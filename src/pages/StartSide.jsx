import { useNavigate } from "react-router";

function StartSide() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-museum-cream flex flex-col overflow-hidden select-none font-flama">
      {/* Header */}
      <header className="flex items-center justify-between px-20 pt-14 pb-6">
        <div>
          <p className="text-primary tracking-[0.3em] uppercase text-sm font-light">
            Museum Name
          </p>
          <h1 className="text-primary text-5xl font-semibold leading-tight mt-1">
            Exhibition Title
          </h1>
        </div>
        <div className="w-24 h-24 rounded-full bg-museum-blue flex items-center justify-center">
          <span className="text-primary text-2xl font-semibold">M</span>
        </div>
      </header>

      {/* Divider */}
      <div className="mx-20 h-px bg-museum-crimson opacity-20" />

      {/* Main content */}
      <main className="flex flex-1 gap-10 px-20 py-12">
        {/* Video 1 */}
        <button
          onClick={() => navigate("/video/1")}
          className="flex-1 relative rounded-2xl overflow-hidden bg-museum-blue group cursor-pointer border-2 border-transparent hover:border-museum-crimson transition-all duration-300"
        >
          <div className="absolute inset-0 bg-museum-blue flex items-center justify-center">
            <span className="text-primary opacity-40 text-lg tracking-widest uppercase">
              Video thumbnail
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-museum-crimson/0 group-hover:bg-museum-crimson/10 transition-all duration-300">
            <div className="w-20 h-20 rounded-full bg-museum-cream/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-primary ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-museum-crimson/80 to-transparent">
            <p className="tracking-widest uppercase text-xs text-museum-cream mb-1 opacity-80 font-light">
              Film 1
            </p>
            <h2 className="text-museum-cream text-2xl font-semibold">
              Video Title Placeholder
            </h2>
          </div>
        </button>

        {/* Video 2 */}
        <button
          onClick={() => navigate("/video/2")}
          className="flex-1 relative rounded-2xl overflow-hidden bg-museum-blue group cursor-pointer border-2 border-transparent hover:border-museum-crimson transition-all duration-300"
        >
          <div className="absolute inset-0 bg-museum-blue flex items-center justify-center">
            <span className="text-primary opacity-40 text-lg tracking-widest uppercase">
              Video thumbnail
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-museum-crimson/0 group-hover:bg-museum-crimson/10 transition-all duration-300">
            <div className="w-20 h-20 rounded-full bg-museum-cream/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-primary ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-museum-crimson/80 to-transparent">
            <p className="tracking-widest uppercase text-xs text-museum-cream mb-1 opacity-80 font-light">
              Film 2
            </p>
            <h2 className="text-primary text-2xl font-semibold">
              Video Title Placeholder
            </h2>
          </div>
        </button>

        {/* Quiz */}
        <button
          onClick={() => navigate("/quiz")}
          className="w-80 rounded-2xl bg-museum-crimson group cursor-pointer hover:bg-museum-crimson/90 transition-all duration-300 flex flex-col items-center justify-center gap-6 p-10 border-2 border-museum-crimson hover:border-museum-cream/30"
        >
          <div className="w-24 h-24 rounded-full border-2 border-museum-cream/40 flex items-center justify-center group-hover:border-museum-cream/80 transition-all duration-300">
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
            <p className="tracking-widest uppercase text-xs text-primary/60 mb-2 font-light">
              Interaktivt
            </p>
            <h2 className="text-primary text-3xl font-semibold leading-tight">
              Tag quizzen
            </h2>
            <p className="text-primary/70 text-sm mt-3 leading-relaxed font-light">
              Test din viden om udstillingen
            </p>
          </div>

          <div className="mt-2 px-6 py-3 border border-museum-cream/30 rounded-full group-hover:bg-museum-cream/10 transition-all duration-300">
            <span className="text-primary text-sm tracking-widest uppercase">
              Start →
            </span>
          </div>
        </button>
      </main>

      {/* Footer hint */}
      <footer className="px-20 pb-8 flex justify-center">
        <p className="text-primary/40 text-sm tracking-widest uppercase font-light">
          Tryk for at vælge
        </p>
      </footer>
    </div>
  );
}

export default StartSide;
