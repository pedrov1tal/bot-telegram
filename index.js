require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const canalId = process.env.CANAL_ID;
const afiliado = process.env.AFILIADO;

console.log("🤖 Bot com scraping rodando...");

// 🔎 Buscar produtos reais da Amazon
async function buscarProduto(produto) {
  try {
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(produto)}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);

    const item = $('.s-result-item').first();

    const titulo = item.find('h2 span').text();
    const linkParcial = item.find('h2 a').attr('href');

    if (!titulo || !linkParcial) return null;

    const link = `https://www.amazon.com.br${linkParcial}&tag=${afiliado}`;

    return {
      titulo,
      link
    };

  } catch (error) {
    console.log("Erro ao buscar produto:", error.message);
    return null;
  }
}

// 🚀 Enviar promoção real
async function enviarPromocao() {
  const produtos = [
    "notebook",
    "mouse gamer",
    "teclado mecânico",
    "headset",
    "monitor"
  ];

  const termo = produtos[Math.floor(Math.random() * produtos.length)];

  const resultado = await buscarProduto(termo);

  if (!resultado) {
    console.log("❌ Nenhum produto encontrado");
    return;
  }

  const mensagem = `
🔥 *PROMOÇÃO REAL* 🔥

🛒 *${resultado.titulo}*

👉 [Ver oferta](${resultado.link})
`;

  bot.sendMessage(canalId, mensagem, {
    parse_mode: "Markdown"
  });

  console.log("✅ Promoção enviada:", resultado.titulo);
}

// ⏱️ A cada 1 hora
setInterval(enviarPromocao, 1000 * 60 * 60);

// 🚀 Primeiro envio
enviarPromocao();