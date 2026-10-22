import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#020306",
          darker: "#010204",
          panel: "#060912",
          surface: "#0a0f1d",
          border: "#151d2f",
          borderLight: "#263553",
          red: {
            DEFAULT: "#ff003c",
            glow: "#ff3366",
            dark: "#2b0a14",
          },
          blue: {
            DEFAULT: "#00f0ff",
            glow: "#38bdf8",
            dark: "#052238",
          },
          neon: "#39ff14",
          warning: "#ffb703",
          magenta: "#ff007f",
          purple: "#9d4edd",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "red-glow": "0 0 25px -5px rgba(255, 0, 60, 0.5)",
        "blue-glow": "0 0 25px -5px rgba(0, 240, 255, 0.5)",
        "neon-glow": "0 0 20px -5px rgba(57, 255, 20, 0.4)",
        "glitch-cyan": "3px 0px 0px rgba(0, 240, 255, 0.75)",
        "glitch-magenta": "-3px 0px 0px rgba(255, 0, 127, 0.75)",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": { opacity: "1" },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": { opacity: "0.6" },
        },
        pixelFloat: {
          "0%, 100%": { opacity: "0.3", transform: "scaleX(1)" },
          "50%": { opacity: "0.9", transform: "scaleX(1.3)" },
        },
      },
      animation: {
        glitch: "glitch 2s infinite ease-in-out",
        scanline: "scanline 8s linear infinite",
        flicker: "flicker 4s infinite",
        pixelFloat: "pixelFloat 3s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
