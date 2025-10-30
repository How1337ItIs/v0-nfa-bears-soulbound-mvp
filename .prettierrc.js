/**
 * PRETTIER CONFIGURATION FOR LIQUID LIGHT SYSTEM
 * 
 * Prettier configuration for consistent code formatting
 * across the liquid light system codebase.
 * 
 * Author: Cursor (Auto-generated)
 * Date: 2025-10-29
 */

module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  
  // Language specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
      },
    },
  ],
  
  // Plugins
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
  
  // Import sorting
  importOrder: [
    '^react$',
    '^react-dom$',
    '^next/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderGroupNamespaceSpecifiers: true,
  
  // Tailwind CSS
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn'],
};
