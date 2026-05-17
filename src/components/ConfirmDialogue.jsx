import { useEffect, useRef } from "react";

function ConfirmDialog({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [onCancel]);

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{
        backgroundColor: `rgba(0,0,0,${visible ? 0.4 : 0})`,
        transition: "background-color 0.3s ease",
      }}
    >
      <div
        ref={ref}
        className="bg-museum-cream rounded-3xl p-16 max-w-2xl w-full mx-8 flex flex-col items-center gap-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <h3 className="text-primary text-4xl font-semibold text-center font-flama">
          {title}
        </h3>
        <p className="text-primary/70 text-2xl text-center leading-relaxed font-light font-flama">
          {body}
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={onConfirm}
            className="w-full bg-museum-crimson text-museum-cream font-semibold text-2xl rounded-full py-5 hover:opacity-90 transition-opacity duration-200 font-flama"
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-museum-blue text-primary font-semibold text-2xl rounded-full py-5 hover:opacity-90 transition-opacity duration-200 font-flama"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
