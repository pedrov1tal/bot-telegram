import axios from 'axios';
import * as cheerio from 'cheerio';
import CONFIG from '../config';
import { Logger } from '../logger';
import type { Produto } from '../types';

export class AmazonScraper {
  static async buscarProduto(produto: string): Promise<Produto | null> {
    let tentativas = 0;

    while (tentativas < CONFIG.scraping.maxRetries) {
      try {
        const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(produto)}`;
        const randomUserAgent = CONFIG.scraping.userAgents[
          Math.floor(Math.random() * CONFIG.scraping.userAgents.length)
        ];

    Logger.debug(`Buscando "${produto}" (tentativa ${tentativas + 1}/${CONFIG.scraping.maxRetries})`);

        const { data } = await axios.get<string>(url, {
          headers: {
            'User-Agent': randomUserAgent,
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          timeout: CONFIG.scraping.timeout,
          maxRedirects: 5
        });

        if (!data) {
          throw new Error('Resposta vazia da API');
        }

        const $ = cheerio.load(data);
        const item = $('.s-result-item').first();

        if (item.length === 0) {
          Logger.warn(`⚠️  Nenhum resultado encontrado para: "${produto}"`);
          return null;
        }

        const titulo = item.find('h2 span').text()?.trim();
        const linkParcial = item.find('h2 a').attr('href');

        if (!titulo || !linkParcial) {
          Logger.warn(`⚠️  Dados incompletos para produto: "${produto}"`);
          return null;
        }

        const link = `https://www.amazon.com.br${linkParcial}&tag=${CONFIG.bot.afiliado}`;

        Logger.debug(`✅ Produto encontrado: ${titulo}`);

        return {
          titulo,
          link
        };

      } catch (error) {
        tentativas++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        Logger.warn(`Tentativa ${tentativas} falhou ao buscar "${produto}": ${errorMessage}`);

        if (tentativas < CONFIG.scraping.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, CONFIG.scraping.retryDelay));
        }
      }
    }

    Logger.error(`❌ Falha permanente ao buscar produto "${produto}" após ${CONFIG.scraping.maxRetries} tentativas`);
    return null;
  }

  static async buscarProdutoAleatorio(): Promise<Produto | null> {
    const termo = CONFIG.produtos[
      Math.floor(Math.random() * CONFIG.produtos.length)
    ];

    Logger.info(`🔍 Buscando produto: "${termo}"...`);
    return this.buscarProduto(termo);
  }
}

export default AmazonScraper;
