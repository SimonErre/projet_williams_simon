import "dotenv/config";

export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  bdname: string;
}

export interface AppConfig {
  BDD: DatabaseConfig;
}

export const config: AppConfig = {
  BDD: {
    host: process.env.DB_HOST || "dpg-dbhm3jqjnfac73abte3g-a",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "web_cnam_db_user",
    password: process.env.DB_PASSWORD || "9fSrX5CsO8yrRA8m7KG34EBkssalY4j1",
    bdname: process.env.DB_NAME || "web_cnam_db"
  }
};

export const { BDD } = config;
export default config;
