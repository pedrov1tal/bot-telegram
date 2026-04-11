import * as fs from 'fs';
import * as path from 'path';
import CONFIG from './config';
import type { LogLevel } from './types';


if (!fs.existsSync(CONFIG.logging.dir)) {
  fs.mkdirSync(CONFIG.logging.dir, { recursive: true });
}

const LOG_LEVELS: Record<string, LogLevel> = {
  error: { level: 0, color: '❌', prefix: 'ERROR' },
  warn: { level: 1, color: '⚠️', prefix: 'WARN' },
  info: { level: 2, color: 'ℹ️', prefix: 'INFO' },
  debug: { level: 3, color: '🔧', prefix: 'DEBUG' }
};

const currentLogLevel = LOG_LEVELS[CONFIG.logging.level]?.level || 2;

function getTimestamp(): string {
  return new Date().toLocaleString('pt-BR');
}

function getLogFileName(): string {
  const hoje = new Date().toISOString().split('T')[0];
  return `bot-${hoje}.log`;
}

function writeToFile(message: string, level: string): void {
  try {
    const logPath = path.join(CONFIG.logging.dir, getLogFileName());
    const timestamp = getTimestamp();
    const logLine = `[${timestamp}] [${level}] ${message}\n`;

    fs.appendFileSync(logPath, logLine, 'utf-8');

    const stats = fs.statSync(logPath);
    if (stats.size > CONFIG.logging.maxFileSize) {
      rotateLog(logPath);
    }
  } catch (error) {
    console.error('Erro ao escrever no arquivo de log:', (error as Error).message);
  }
}

function rotateLog(logPath: string): void {
  const dir = path.dirname(logPath);
  const files = fs.readdirSync(dir)
    .filter(f => f.startsWith('bot-') && f.endsWith('.log'))
    .sort()
    .reverse();

  while (files.length >= CONFIG.logging.maxFiles) {
    const oldFile = path.join(dir, files.pop()!);
    fs.unlinkSync(oldFile);
  }
}

export class Logger {
  static error(message: string, error?: Error): void {
    if (currentLogLevel >= LOG_LEVELS.error.level) {
      const fullMessage = error ? `${message} | ${error.message}` : message;
      console.error(`${LOG_LEVELS.error.color} ${fullMessage}`);
      writeToFile(fullMessage, LOG_LEVELS.error.prefix);
    }
  }

  static warn(message: string): void {
    if (currentLogLevel >= LOG_LEVELS.warn.level) {
      console.warn(`${LOG_LEVELS.warn.color} ${message}`);
      writeToFile(message, LOG_LEVELS.warn.prefix);
    }
  }

  static info(message: string): void {
    if (currentLogLevel >= LOG_LEVELS.info.level) {
      console.log(`${LOG_LEVELS.info.color} ${message}`);
      writeToFile(message, LOG_LEVELS.info.prefix);
    }
  }

  static debug(message: string): void {
    if (CONFIG.isDev && currentLogLevel >= LOG_LEVELS.debug.level) {
      console.log(`${LOG_LEVELS.debug.color} ${message}`);
      writeToFile(message, LOG_LEVELS.debug.prefix);
    }
  }

  static custom(message: string, emoji: string = '📍'): void {
    const timestamp = getTimestamp();
    const fullMessage = `[${timestamp}] ${emoji} ${message}`;
    console.log(fullMessage);
    writeToFile(fullMessage, 'CUSTOM');
  }
}

export default Logger;
