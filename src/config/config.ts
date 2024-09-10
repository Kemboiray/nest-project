import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  url: string;
}

export interface AuthConfig {
  jwtSecret: string;
}

export interface AppConfig {
  port: number;
}

export const databaseConfig = registerAs("database", (): DatabaseConfig => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return {
    url: process.env.DATABASE_URL,
  };
});

export const authConfig = registerAs("auth", (): AuthConfig => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return {
    jwtSecret: process.env.JWT_SECRET,
  };
});

export const appConfig = registerAs(
  "app",
  (): AppConfig => ({
    port: parseInt(process.env.PORT || "3000", 10),
  }),
);
