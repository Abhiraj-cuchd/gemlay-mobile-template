/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4AF37",
          light: "#EBDFBA",
          dark: "#8A6F20",
        },
        secondary: {
          DEFAULT: "#1F2937",
          light: "#374151",
          dark: "#111827",
        },
        accent: {
          DEFAULT: "#EF4444",
          light: "#FCA5A5",
          dark: "#DC2626",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        background: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          gray: "#F9FAFB",
          dark: "#000000",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        border: {
          light: "#E5E7EB",
          medium: "#D1D5DB",
          dark: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};
