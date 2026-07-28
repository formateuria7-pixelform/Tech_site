export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ink: '#0B0C0E',
        coal: '#12141A',
        steel: '#1D212A',
        fog: '#8B929E',
        paper: '#F4F2ED',
        volt: '#C8FF3D',
        copper: '#E0703C',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseline: {
          '0%,100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        pulseline: 'pulseline 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
