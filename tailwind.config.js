/** @type {import('tailwindcss').Config} */
export default {
  css: [
    '@/assets/css/tailwind.css',
  ],
  content: [],
  theme: {
    extend: {
      colors: {
        bg:           '#F7F5F0',
        'bg-deep':    '#EDE9E1',
        surface:      '#FFFFFF',
        'surface-2':  '#F2F0EB',
        border:       '#E0DBD3',
        'border-dim': '#EDE9E1',
        ink:          '#1A1614',
        'ink-dim':    '#5C5751',
        'ink-muted':  '#A09890',
        accent:       '#2B5FFF',
        'accent-dim': '#1A3FBB',
        'accent-bg':  '#EEF2FF',
        // backwards-compat
        primary_light: '#F7F5F0',
        primary_dark:  '#1A1614',
        green:         '#4D7C5C',
        darkgrey:      '#5C5751',
      },
      fontFamily: {
        syne:    ['Syne', 'sans-serif'],
        mono:    ['"Azeret Mono"', 'monospace'],
        verdana: ['Verdana', 'sans-serif'],
        georgia: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
