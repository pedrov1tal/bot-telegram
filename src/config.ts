import 'dotenv/config';
import type { AppConfig } from './types';

/**
 * 🔧 Arquivo de configuração centralizado (TypeScript)
 * Valida e exporta todas as configurações do aplicativo
 */

// ✅ Variáveis de ambiente obrigatórias
const REQUIRED_ENV_VARS: string[] = [
  'TOKEN',     // Token do bot Telegram
  'CANAL_ID',  // ID do canal para enviar mensagens
  'AFILIADO'   // ID de afiliado da Amazon
];

// Validar variáveis obrigatórias
const missingVars = REQUIRED_ENV_VARS.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`❌ Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
  console.error(`📝 Copie .env.example para .env e preencha os valores`);
  process.exit(1);
}

// 🔧 Configuração centralizada
const CONFIG: AppConfig = {
  // Ambiente
  env: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',

  // Bot Telegram
  bot: {
    token: process.env.TOKEN,
    canalId: process.env.CANAL_ID,
    afiliado: process.env.AFILIADO,
    pollingInterval: 300 // ms - intervalo de polling
  },

  // Scraping da Amazon
  scraping: {
    timeout: 10000, // 10 segundos
    maxRetries: 3,
    retryDelay: 2000, // 2 segundos entre tentativas
    userAgents: [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    ]
  },

  // Agendamento
  schedule: {
    intervalo: parseInt(process.env.INTERVALO_ENVIO || '') || (1000 * 60 * 60), // 1 hora por padrão
    envioImediato: true // Enviar na inicialização
  },

  // Logging
  logging: {
    level: (process.env.LOG_LEVEL as 'error' | 'warn' | 'info' | 'debug') || 'info',
    dir: process.env.LOG_DIR || './logs',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5
  },

  // Produtos para buscar
  produtos: [
    'notebook',
    'mouse gamer',
    'teclado mecânico',
    'headset',
    'monitor',
    'mousepad',
    'webcam',
    'fone de ouvido',
    'speaker bluetooth',
    'carregador rápido'
  ]
};

// ✅ Validação de intervalo
if (CONFIG.schedule.intervalo < 600000) { // Mínimo 10 minutos
  console.warn('⚠️  Intervalo muito curto! Definindo para 10 minutos.');
  CONFIG.schedule.intervalo = 600000;
}

// ✅ Log de configuração na inicialização
if (CONFIG.isDev) {
  console.log('📋 Configuração carregada:');
  console.log(`  • Ambiente: ${CONFIG.env}`);
  console.log(`  • Intervalo: ${CONFIG.schedule.intervalo / 1000 / 60} minutos`);
  console.log(`  • Logging: ${CONFIG.logging.level}`);
}

export default CONFIG;
