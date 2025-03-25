const path = require('path');
const fs = require('fs');

module.exports = ({ config }) => {
  // Find the absolute path to the workspace root
  const workspaceRoot = path.resolve(__dirname, '../../../');
  
  // Add packages to resolve.modules
  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve(__dirname, '../node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  // Set alias for emotion packages
  config.resolve.alias = {
    ...config.resolve.alias,
    '@emotion/react': path.resolve(workspaceRoot, 'node_modules/@emotion/react'),
    '@emotion/styled': path.resolve(workspaceRoot, 'node_modules/@emotion/styled'),
  };

  // Make sure TypeScript extensions are handled
  config.resolve.extensions = [
    ...(config.resolve.extensions || []),
    '.ts', '.tsx', '.js', '.jsx', '.mjs'
  ];

  // Clear out any conflicting rules for .ts/.tsx files
  config.module.rules = config.module.rules.filter(rule => {
    if (!rule.test) return true;
    const test = rule.test.toString();
    return !(test.includes('ts') || test.includes('tsx'));
  });

  // Add unified rules for all JavaScript and TypeScript files
  config.module.rules.push({
    test: /\.(jsx?|tsx?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('@babel/preset-env'),
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript')
          ],
          plugins: [
            require.resolve('@babel/plugin-transform-runtime'),
            [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }]
          ]
        }
      }
    ]
  });

  return config;
};
