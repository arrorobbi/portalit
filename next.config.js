// next.config.js
require("dotenv").config();

module.exports = {
  images: {
    domains: ["localhost"], // Add the IP address or domain name here
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_PRTG_URL: process.env.NEXT_PUBLIC_API_PRTG_URL
  },
};
