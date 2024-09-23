module.exports = {
  // Use "react-app" directly instead of "extends"
  languageOptions: {
    parser: '@babel/eslint-parser', // Required if you use JSX
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 'off', // Example rule
      },
    },
  ],
};
