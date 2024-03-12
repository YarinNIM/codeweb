const colors = require('tailwindcss/colors');
const getColor = (color, baseIndex = 100) => ({
  ...color,
  DEFAULT: color[baseIndex],
});

const loading = {
  animation: 'loading 0.4s infinite alternate',
  keyframes: {
    to: {
      opacity: 0.7,
      transform: 'translate3d(0, -0.2rem, 0)',
    },
  },
};

module.exports = {
  content: [
    '../../packages/ui/src/**/*.{html,js,jsx,ts,tsx}',
    './src/**/*.{html,js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        default: getColor(colors.gray),
        primary: getColor(colors.amber),
        secondary: { ...getColor(colors.gray), 700: colors.gray[400] },
        success: getColor(colors.green),
        error: getColor(colors.red),
        warning: getColor(colors.orange),
        info: getColor(colors.sky),
      },
      animation: {
        loading: loading.animation,
      },
      keyframes: {
        loading: loading.keyframes,
      },
    },
  },

  plugins: [],

  corePlugins: {
    borderStyle: 'solid',
  },
};
