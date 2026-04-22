import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rawline: ['Rawline', 'Raleway', 'sans-serif'],
      },
      colors: {
        gov: {
          blue: '#1351b4',
          lightBlue: '#dbeafe',
          darkBlue: '#0c326f',
          red: '#e52207',
          green: '#168821',
          yellow: '#ffcd07',
          gray: '#f8f9fa',
          border: '#ccc',
          text: '#333333',
        }
      },
      borderRadius: {
        'gov': '2rem', // Arredondamento padrão dos botões do Gov.br
      }
    },
  },
  plugins: [],
};
export default config;
