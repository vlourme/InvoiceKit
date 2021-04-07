module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    fontFamily: {
      body: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      height: {
        '1/9': '11.1%',
        '8/9': '88.9%',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
}
