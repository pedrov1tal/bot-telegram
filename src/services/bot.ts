import TelegramBot from 'node-telegram-bot-api';
import CONFIG from '../config';
import { Logger } from '../logger';
import AmazonScraper from './scraper';

export class BotService {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(CONFIG.bot.token, {
      polling: {
        interval: CONFIG.bot.pollingInterval
      }
    });

    Logger.info('🤖 Bot inicializado com sucesso');
  }

  async enviarPromocao(): Promise<void> {
    try {
      const resultado = await AmazonScraper.buscarProdutoAleatorio();

      if (!resultado) {
        Logger.warn('⚠️  Nenhum produto encontrado nesta tentativa');
        return;
      }

      const mensagem = `
🔥 *PROMOÇÃO REAL* 🔥

🛒 *${resultado.titulo}*

👉 [Ver oferta](${resultado.link})
`;

      await this.bot.sendMessage(CONFIG.bot.canalId, mensagem, {
        parse_mode: 'Markdown'
      });

      Logger.info(`✅ Promoção enviada: ${resultado.titulo}`);

    } catch (error) {
      Logger.error('❌ Erro ao enviar promoção', error instanceof Error ? error : new Error(String(error)));
    }
  }

  iniciarAgendamento(): NodeJS.Timer {
    Logger.info(`⏱️  Agendador iniciado - intervalo de ${CONFIG.schedule.intervalo / 1000 / 60} minutos`);

    const intervalId = setInterval(() => {
      this.enviarPromocao();
    }, CONFIG.schedule.intervalo);

    if (CONFIG.schedule.envioImediato) {
      this.enviarPromocao();
    }

    return intervalId;
  }

  parar(): void {
    Logger.info('🛑 Encerrando bot...');
    this.bot.stopPolling();
  }
}

export default BotService;
