/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#12266b",
        "primary-container": "#2c3e82",
        "on-primary": "#ffffff",
        "on-primary-container": "#9bacf8",
        "primary-fixed": "#dde1ff",
        "primary-fixed-dim": "#b7c4ff",
        "on-primary-fixed": "#001453",
        "on-primary-fixed-variant": "#304286",
        secondary: "#006b5f",
        "secondary-container": "#6df5e1",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#006f64",
        "secondary-fixed": "#71f8e4",
        "secondary-fixed-dim": "#4fdbc8",
        tertiary: "#422700",
        "tertiary-container": "#603b00",
        "on-tertiary-container": "#f49d09",
        "tertiary-fixed": "#ffddb8",
        "tertiary-fixed-dim": "#ffb95f",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#d8dae0",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3f9",
        "surface-container": "#eceef3",
        "surface-container-high": "#e7e8ee",
        "surface-container-highest": "#e1e2e8",
        "surface-variant": "#e1e2e8",
        "on-surface": "#191c20",
        "on-surface-variant": "#454650",
        outline: "#757682",
        "outline-variant": "#c5c5d2",
        error: "#EF4444",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        success: "#10B981",
        "success-container": "#d1fae5",
        "on-success-container": "#065f46"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      spacing: {
        unit: "4px",
        gutter: "32px",
        "margin-desktop": "64px",
        "section-gap": "60px",
        "component-padding-md": "16px",
        "component-padding-lg": "24px",
        "container-max": "1440px"
      },
      fontFamily: {
        sans: ["Hanken Grotesk", "sans-serif"],
        display: ["Hanken Grotesk", "sans-serif"],
        body: ["Hanken Grotesk", "sans-serif"]
      }
    },
  },
  plugins: [],
};
