// tailwind.config.js
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
};

export default config;
