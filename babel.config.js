module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          '*': './src/*',
          'app/*': './src/app/*',
          'entities/*': './src/entities/*',
          'shared/*': './src/shared/*',
          'screens/*': './src/screens/*',
          'native/*': './src/native/*'
        },
      },
    ],
    '@babel/plugin-proposal-export-namespace-from',
    'react-native-worklets/plugin',
  ],
};
