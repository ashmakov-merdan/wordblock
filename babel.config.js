module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '*': './src/*',
          'app/*': './src/app/*',
          'shared/*': './src/shared/*',
        }
      }
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-worklets/plugin'
  ]
};
