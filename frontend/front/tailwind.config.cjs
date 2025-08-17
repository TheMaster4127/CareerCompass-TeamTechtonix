/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        cc: {
          50: "#F2FCF7",
          100: "#E6FAF0",
          200: "#C8F3DF",
          300: "#A7EBCB",
          400: "#5FDDA3",
          500: "#22C587",  // primary button
          600: "#17AE76",  // hover
          700: "#0F8D61",  // navbar link active
          800: "#0B6E4D",
          900: "#0A5A40",
          // accents
          mint: "#EAFBF3",
          ring: "rgba(34,197,143,0.25)"
        }
      },
      fontFamily: {
        mont: ["Montserrat", "ui-sans-serif", "system-ui"],
        open: ["Open Sans", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 20px 40px -20px rgba(34,197,143,0.35)",
        card: "0 12px 30px rgba(0,0,0,0.06)"
      },
      backgroundImage: {
        "hero-grad": "linear-gradient(180deg, #F7FFFA 0%, #EAFBF3 100%)",
        "cta-grad": "linear-gradient(180deg, #22C587 0%, #17AE76 100%)"
      },
      borderRadius: {
        xl2: "14px"
      }
    }
  },
  plugins: []
};
