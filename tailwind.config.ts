// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Important for Angular to scan your templates and components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8",
        secondary: "#FBBF24",
        danger: "#EF4444",
        // Add your own custom colors here
        mycustomblue: "#0077cc",
      },
    },
  },
  plugins: [],
};

// PRIMARY - #ff820d
