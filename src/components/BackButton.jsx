import { useNavigate } from "react-router";

function BackButton({ onClick }) {
  const navigate = useNavigate();

  const path =
    "M40.6,-59.2C48.1,-58.4,46.5,-39.5,52.3,-24.6C58,-9.6,71.1,1.2,75.2,14.7C79.4,28.2,74.6,44.3,62.2,48.1C49.9,51.9,30,43.2,14.1,47.7C-1.8,52.2,-13.7,69.7,-23.1,70.7C-32.5,71.6,-39.5,55.9,-39.8,42C-40.1,28.1,-33.8,16,-32.6,6.4C-31.4,-3.3,-35.3,-10.6,-37.8,-22.3C-40.3,-34,-41.5,-50.2,-34.9,-51.4C-28.4,-52.7,-14.2,-39,1.2,-40.8C16.6,-42.6,33.2,-60,40.6,-59.2Z";

  return (
    <button
      onClick={onClick ?? (() => navigate("/"))}
      style={{
        position: "fixed",
        top: -95,
        left: -110,
        zIndex: 50,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        width: "320px",
        height: "320px",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Shadow/border — primary dark, slightly larger */}
        <path
          d={path}
          fill="var(--color-primary, #1a2e44)"
          transform="translate(100 100) scale(1.11)"
        />
        {/* Main blob — museum blue */}
        <path
          d={path}
          fill="var(--color-museum-cream, #f2f1da)"
          transform="translate(100 100)"
        />
        {/* Arrow */}
        <g transform="translate(100 112)">
          <line
            x1="38"
            y1="0"
            x2="-8"
            y2="0"
            stroke="var(--color-primary, #1a2e44)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <polyline
            points="10,-13 -8,0 10,13"
            fill="none"
            stroke="var(--color-primary, #1a2e44)"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </button>
  );
}

export default BackButton;
