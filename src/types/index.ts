/**
 * 🔧 Tipos TypeScript para o projeto
 */

export interface BotConfig {
  token: string;
  canalId: string;
  afiliado: string;
  pollingInterval: number;
}

export interface ScrapingConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  userAgents: string[];
}

export interface ScheduleConfig {
  intervalo: number;
  envioImediato: boolean;
}

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  dir: string;
  maxFileSize: number;
  maxFiles: number;
}

export interface AppConfig {
  env: 'development' | 'production';
  isDev: boolean;
  isProd: boolean;
  bot: BotConfig;
  scraping: ScrapingConfig;
  schedule: ScheduleConfig;
  logging: LoggingConfig;
  produtos: string[];
}

export interface Produto {
  titulo: string;
  link: string;
}

export interface LogLevel {
  level: number;
  color: string;
  prefix: string;
}
