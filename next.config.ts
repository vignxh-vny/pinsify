import type { NextConfig } from "next";
import path from "path";
import os from "os";

// Automatically whitelist all local IPv4 network interfaces (Wi-Fi, LAN, hotspot)
const localIps = Object.values(os.networkInterfaces())
  .flatMap((list) =>
    list ? list.filter((item) => item.family === "IPv4").map((item) => item.address) : []
  );

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: [
    ...localIps,
    "192.168.0.7",
    "192.168.0.*",
    "192.168.*",
    "192.168.3.1",
    "192.168.0.10",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
