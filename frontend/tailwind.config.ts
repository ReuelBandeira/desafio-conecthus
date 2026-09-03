import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens extraídos com precisão do export de design do Adobe XD
        // (imagens-docs/telahome/detalhestelahome + amostragem de pixel do
        // mockup) — não são mais aproximações visuais.
        navy: {
          DEFAULT: '#0D1931', // fundo da sidebar, título "Olá Millena!"
        },
        teal: {
          DEFAULT: '#00AAC1', // acento primário, item ativo do menu, logo
          button: '#0290A4', // --unnamed-color-0290a4, botão "Cadastrar Usuário"
          dark: '#00606D', // --00606d-hover no export do design
        },
        green: {
          DEFAULT: '#0B2B25', // título de página ("Home"), avatar, texto do card de boas-vindas
        },
        // Mesmo tom de "green" — mantido como alias porque vários componentes
        // (Button, FloatingInput, Pagination, Breadcrumb, globals.css...)
        // ainda usam text-ink/text-ink-muted.
        ink: {
          DEFAULT: '#0B2B25',
          muted: '#495264',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#F3F3F3',
          filled: '#F4F4F4',
          border: '#E0E0E0',
        },
        alert: {
          orange: '#FF7700',
          red: '#FF4B4A',
          yellow: '#FFCC00',
          green: '#00C857',
        },
      },
      fontFamily: {
        sans: [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0px 1px 4px #00000029',
        modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
