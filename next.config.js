// next.config.js
require("dotenv").config();

module.exports = {
  images: {
    domains: ["10.100.101.124"], // Add the IP address or domain name here
  },
  env: {
    BE_HOST: process.env.BE_HOST,
  },
};
