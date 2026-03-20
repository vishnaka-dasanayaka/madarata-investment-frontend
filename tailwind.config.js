/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Replace the hex code with your brand's specific color
        primary: "#001568",
        link: "#00f",
      },
    },
  },
  plugins: [],
};
