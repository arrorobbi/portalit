// next.config.js
require("dotenv").config();

module.exports = {
  images: {
    domains: ["10.100.101.124"], // Add the IP address or domain name here
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};
