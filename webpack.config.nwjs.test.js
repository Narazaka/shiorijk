const config = require("./webpack.config.nwjs");
config.devtool = "inline-source-map";
module.exports = config;
