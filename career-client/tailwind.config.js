
/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default  withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx }",],
  theme: {
    
    animation: {
        marquee: "marquee var(--duration, 10s) linear infinite",
        
      },
      colors:{
        green:'#134e4a'
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(50%)" },
        },
      },
    screens: {
      'sm': '100px',
      // => @media (min-width: 640px) { ... }

      'md': '780px',
      // => @media (min-width: 1024px) { ... }
      
      'xl': '1278px',
      // => @media (min-width: 1280px) { ... }

      'lg': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      fontFamily: {
        'Joti': ["Joti One", 'serif'],
        'Chau': ["Chau Philomene One", 'serif'],
        'Monoton': ["Monoton", 'serif'],
        'Rubik': ["Rubik Scribble", 'serif'],
        'Bungee': ["Bungee Outline", 'serif'],

      },
      
    
    },
  },
 plugins: [
  
 ],
});