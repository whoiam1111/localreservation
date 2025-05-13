module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(0deg)' },
            '25%': { transform: 'rotate(3deg)' },
            '75%': { transform: 'rotate(-3deg)' },
          },
          floatUpDown: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          spinOnce: {
            from: { transform: 'rotateY(0deg)' },
            to: { transform: 'rotateY(360deg)' },
          },
          pulse: {
            '0%': { opacity: '0.5' },
            '50%': { opacity: '1' },
            '100%': { opacity: '0.5' },
          },
        },
        animation: {
          wiggle: 'wiggle 1.2s ease-in-out infinite',
          float: 'floatUpDown 2s ease-in-out infinite',
          spinOnce: 'spinOnce 1.5s ease-in-out',
          pulse: 'pulse 2s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  };
  