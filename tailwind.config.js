/** Tailwind config with aeson.ai tokens added to theme.extend.colors
 * This file was added to declare named colors that map to CSS variables
 * created in src/app/globals.css. Adjust `content` paths if your app uses
 * other folders.
 */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: 'var(--bg-primary)',
        'surface-2': 'var(--bg-secondary)',
        'surface-3': 'var(--bg-tertiary)',
        hairline: 'var(--border-hairline)',
        ink: 'var(--text-primary)',
        muted: 'var(--text-secondary)',
        accent: 'var(--accent)',
        'accent-hover': 'var(--accent-hover)'
      }
    }
  },
  plugins: []
};
