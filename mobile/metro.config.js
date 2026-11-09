// Metro (empacotador do app) não deve olhar a pasta backend/ (Java): ela não faz parte do app
// e só deixaria a busca de arquivos mais lenta.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.blockList = [/[\/]backend[\/].*/];

module.exports = config;
