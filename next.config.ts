import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "chickchack.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/portal/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "d3gxnzvagcr4t9.cloudfront.net",
        port: "",
        pathname: "/**",
        search: "",
      },
    ],
  },
};

export default config;
