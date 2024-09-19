import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  uri: string;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiry: number;
}

export interface AppConfig {
  port: number;
}

export const databaseConfig = registerAs("database", (): DatabaseConfig => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  return {
    uri: process.env.MONGODB_URI,
  };
});

export const authConfig = registerAs("auth", (): AuthConfig => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: parseInt(process.env.JWT_EXPIRY || "60", 10),
  };
});

export const appConfig = registerAs(
  "app",
  (): AppConfig => ({
    port: parseInt(process.env.PORT || "3000", 10),
  }),
);
