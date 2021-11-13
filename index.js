const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '2096481138:AAHUMikvkC75wvabDgGEzV8DzUlIgmFbo2g';
const weatherApiKey = 'd48857057355339c0bc1961bb73293f3';
const bot = new TelegramBot(token, {
  polling: true
});

const start = () => {
  const getWeather = (chatId, city) => {
    axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&&appid=${weatherApiKey}`).then((response) => {
      const {
        name,
        weather,
        main,
        wind,
        clouds
      } = response.data;
  
    bot.sendPhoto(chatId, `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`)
    bot.sendMessage(
        chatId,
        `На сегодня температура в городе ${name} составляет ${~main.temp}°C. Скорость ветра ${wind.speed} метров в секунду, облачность ${clouds.all} %`, {
          parse_mode: "HTML"
        }
      );
    }, error => {
    bot.sendMessage(
        chatId,
        `Не нашли погоду для города <b>${city}</b>, возможно неправильно набрали название, попробуйте еще раз!`, {
          parse_mode: "HTML"
        }
      );
    });
  }

  bot.setMyCommands([
      {command: '/start', description: 'Приветствие!'},
      {command: '/weather', description: 'Узнай погоду в своем городе!!'}
  ])
  bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        `Здравствуйте, ${msg.from.first_name}, Вас приветствует <b>myWeatherBOT</b>!
    С помощью меня вы сможете узнать погоду, 
    всего лишь отправив мне команду /weather <b>город</b>.
    Желаю удачи!`, {
          parse_mode: "HTML"
        }
      );
    });
  bot.onText(/\/weather/, (msg, match) => {
    const chatId = msg.chat.id;
    const city = match.input.split(' ')[1];
    if (city === undefined) {
      bot.sendMessage(
        chatId,
        `Пропустили название города после команды /weather, попробуйте еще раз.`
      );
      return;
    }
    getWeather(chatId, city);
  });
  
}
start()