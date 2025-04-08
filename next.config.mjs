/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: "127.0.0.1",
        DATABASE_PORT: "5432",
        DATABASE_USER: "postgres",
        DATABASE_PASSWORD: "postgre",

        JWT_SECRET: "0x5f16f4c7f149e4a2e8c1e3b0b5a8e3d9c7b1a0f4d2c9b8a7e6d5c4b3a2f1e0d",
        ACCESS_TOKEN_EXPIRES_IN: "15m",
        REFRESH_TOKEN_EXPIRES_IN: "7d",
    }
};

export default nextConfig;
