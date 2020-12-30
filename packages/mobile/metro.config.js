const path = require('path');

const reactNativePath = require.resolve('react-native');
const reactNativeFolder = `${
  reactNativePath.split('node_modules/react-native/')[0]
}node_modules/react-native/`;

const getConfig = async () => ({
  watchFolders: [path.resolve(__dirname, '../../')],
  transformer: {
    getTransformOptions: async () => ({
      transform: {experimentalImportSupport: false, inlineRequires: false},
    }),
  },
  resolver: {
    blacklistRE: new RegExp(
      `^((?!${reactNativeFolder.replace(
        '/',
        '\\/',
      )}).)*\\/node_modules\\/react-native\\/.*$`,
    ),
  },
});

module.exports = getConfig();
