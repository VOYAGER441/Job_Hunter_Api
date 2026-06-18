import { NODE_ENVS } from "@/utils/appConstant";

// app url
export const APP_URL = process.env.APP_URL;

// env
export const NODE_ENV = process.env.NODE_ENV || 'dev' as NODE_ENVS;

// port 
export const PORT = process.env.PORT || 5000;

// MONGODB_URI
export const MONGODB_URI = process.env.MONGODB_URI || "";

// LOG
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
export const LOG_OUTPUT = process.env.LOG_OUTPUT || 'console';
export const LOG_FILE_PATH = process.env.LOG_FILE_PATH || 'logs/app.log';

// APPWRITE
export const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
export const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

export const REDIS_HOST=process.env.REDIS_HOST || 'redis';
export const REDIS_PORT=process.env.REDIS_PORT || 6379;
export const REDIS_PASSWORD=process.env.REDIS_PASSWORD || 'your_redis_password';
export const REDIS_DB=process.env.REDIS_DB || 0;

// jwt
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

// job sources
export const THEMUSE_API_URL = process.env.THEMUSE_API_URL;
export const REMOTEOK_API_URL = process.env.REMOTEOK_API_URL;