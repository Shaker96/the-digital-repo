import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'search-cover': "url('/cover.jpg')",
        'profile-cover': "url('/profile-cover.jpg')",
        'robot': "url('/robot.jpg')"
      },
      colors: {
        blizzard: '#ABE8E9',
        sea: '#44CCDF',
        blueYonder: '#4A7EA6',
        independence: '#434867',
        navy: '#303682'
      }
    },
  },
  plugins: [],
}
export default config
