// next.config.js
require("dotenv").config();

module.exports = {
  env: {
    BE_HOST: process.env.BE_HOST,
  },
};
