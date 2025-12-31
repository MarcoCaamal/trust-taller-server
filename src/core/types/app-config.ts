export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  baseDomain: string;
  problemDocsBaseUrl: string;
  corsOrigins: string[];
}
