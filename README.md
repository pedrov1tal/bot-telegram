# 🤖 Bot Telegram - Scraping Amazon

Bot automatizado para buscar produtos da Amazon e enviar promoções em tempo real para um canal Telegram.

## 📋 Requisitos

- Node.js 14.0 ou superior
- npm ou yarn
- Conta no Telegram com bot criado
- ID de um canal Telegram

## 🚀 Instalação

### 1. Clonar ou baixar o projeto

```bash
cd bot-telegram
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com seus dados:

```env
TOKEN=seu_token_do_bot
CANAL_ID=seu_id_do_canal
AFILIADO=seu_id_afiliado_amazon
INTERVALO_ENVIO=3600000
NODE_ENV=development
```

## 📚 Como obter as credenciais

### Token do Bot
1. Abra [BotFather no Telegram](https://telegram.me/BotFather)
2. Envie `/newbot`
3. Siga as instruções e receba seu token
4. Copie o token para a variável `TOKEN`

### ID do Canal
1. Crie um canal no Telegram
2. Adicione seu bot como administrador
3. Envie uma mensagem ao canal
4. Use este endpoint (substitua TOKEN):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
5. Procure por `chat` → `id` na resposta JSON
6. Copie o ID para a variável `CANAL_ID`

### ID de Afiliado Amazon
1. Inscreva-se no [Programa de Associados Amazon](https://associados.amazon.com.br/)
2. Obtenha seu ID de rastreamento
3. Copie para a variável `AFILIADO`

## 💻 Uso

### Desenvolvimento

```bash
npm run dev
```

Inicia o bot em modo desenvolvimento com logs detalhados.

### Produção

```bash
npm start
```

Inicia o bot em modo produção normal.

### Ver logs

```bash
npm run logs
```

Exibe os últimos logs do sistema.

## ⚙️ Configurações

Todas as configurações também podem ser feitas via variáveis de ambiente:

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `TOKEN` | - | Token do bot Telegram (obrigatório) |
| `CANAL_ID` | - | ID do canal destino (obrigatório) |
| `AFILIADO` | - | ID de afiliado Amazon (obrigatório) |
| `INTERVALO_ENVIO` | 3600000 | Intervalo entre buscas em ms (1 hora) |
| `NODE_ENV` | development | Ambiente (development/production) |
| `LOG_LEVEL` | info | Nível de logs (error/warn/info/debug) |
| `LOG_DIR` | ./logs | Diretório para arquivos de log |

## 📊 Estrutura do Projeto

```
bot-telegram/
├── index.js              # Arquivo principal
├── config.js             # Configurações centralizadas
├── logger.js             # Sistema de logging
├── package.json          # Dependências e scripts
├── .env.example          # Template de variáveis
├── .env                  # Variáveis locais (não commit!)
├── .gitignore           # Arquivos ignorados
├── logs/                # Arquivos de log (diário)
└── README.md            # Este arquivo
```

## 🔍 Como funciona

1. **Inicialização**: Bot conecta ao Telegram e valida configurações
2. **Busca**: A cada intervalo (padrão 1h), seleciona um produto aleatório
3. **Scraping**: Busca o produto na Amazon usando axios + cheerio
4. **Envio**: Se encontrado, envia mensagem formatada ao canal
5. **Logging**: Registra todas as ações em arquivo e console

## 🛡️ Tratamento de Erros

O bot possui tratamento robusto de erros:
- Validação de variáveis de ambiente no início
- Timeouts em requisições HTTP
- Tentativas de reconexão automática
- Logs detalhados de todos os erros
- Graceful shutdown ao receber SIGINT (Ctrl+C)

## 📝 Logs

Os logs são salvos em `./logs/bot-YYYY-MM-DD.log` com as seguintes informações:
- Timestamp detalhado
- Nível de severidade
- Mensagem descritiva
- Erros com stack trace

## 🐳 Docker (Opcional)

Para executar em container:

```bash
docker build -t bot-telegram .
docker run --env-file .env bot-telegram
```

## 🔗 Dependências

- **node-telegram-bot-api**: Integração com Telegram
- **axios**: Requisições HTTP
- **cheerio**: Parse de HTML
- **dotenv**: Gerenciamento de variáveis de ambiente

## 🚨 Troubleshooting

### Bot não envia mensagens
- Verificar se o TOKEN está correto
- Verificar se o CANAL_ID é válido
- Confirmar que o bot é administrador do canal
- Ver logs em `./logs/`

### Erro de timeout
- Aumentar `timeout` em `config.js`
- Verificar conexão de internet
- Tentar usar um proxy se Amazon bloqueia

### Amazon bloqueou requisições
- User-Agent é rotacionado automaticamente
- Aumentar `retryDelay` em `config.js`
- Considerar usar proxy com rotação de IP

## 📄 Licença

ISC

## 👨‍💻 Autor

Bot de Scraping Telegram

## 🤝 Contribuindo

Sinta-se livre para fazer fork, abrir issues e pull requests!

## ⚠️ Aviso Legal

Este bot respeita o `robots.txt` e os ToS da Amazon. Use responsavelmente.
