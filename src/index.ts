import BotService from './services/bot';
import CONFIG from './config';
import { Logger } from './logger';

(async () => {
  try {
    Logger.info('🤖 Iniciando bot com scraping...');

    const botService = new BotService();

    const intervalId = botService.iniciarAgendamento();

    process.on('SIGINT', () => {
      Logger.custom('Recebido SIGINT - encerrando aplicação', '🛑');
      clearInterval(intervalId);
      botService.parar();
      setTimeout(() => {
        Logger.info('✅ Bot encerrado com sucesso');
        process.exit(0);
      }, 1000);
    });

    process.on('uncaughtException', (error) => {
      Logger.error('❌ Exceção não capturada', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      Logger.error('❌ Promise rejection não tratada', reason instanceof Error ? reason : new Error(String(reason)));
      process.exit(1);
    });

    Logger.info('✅ Bot rodando em modo ' + CONFIG.env);

  } catch (error) {
    Logger.error('❌ Erro na inicialização', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  }
})();
