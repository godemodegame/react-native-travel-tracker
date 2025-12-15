const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-svg', 'react-native-svg-web'],
      },
    },
    argv
  );

  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native-svg': 'react-native-svg-web',
  };

  return config;
};
