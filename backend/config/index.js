import { config } from 'dotenv';

config({
    path: "backend/config/.env",
});

// SERVER
export const PORT = process.env.PORT || process.env.APP_PORT;
export const DOMAIN = process.env.APP_DOMAIN;

// DATABASE
export const DB = process.env.APP_DB;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES = process.env.JWT_EXPIRES;

// COOKIE
export const COOKIE_EXPIRES = process.env.COOKIE_EXPIRES;

// SMTP
export const SMTP_HOST = process.env.APP_SMTP_HOST;
export const SMTP_MAIL = process.env.APP_SMTP_MAIL;
export const SMTP_PW = process.env.APP_SMTP_PASSWORD;
export const SMTP_TEST1 = process.env.APP_SMTP_TOID1;
export const SMTP_TEST2 = process.env.APP_SMTP_TOID2;
