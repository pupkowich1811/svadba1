// netlify/functions/telegram.js

// ID получателей (молодожёны)
const RECIPIENTS = [
  '1556013800', // DANILA
  '761672485'   // Polya
];

const BOT_TOKEN = '8288274911:AAGuEGWP0j0gf6z2S9DogLlZtjUin9q2x0g'; // ← ЗАМЕНИ НА СВОЙ ТОКЕН ОТ @BotFather

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, attendance } = data;

    let statusText = 'Не указано';
    if (attendance === 'yes') statusText = 'Да, с радостью!';
    if (attendance === 'no') statusText = 'К сожалению, не смогу';

    const message = `💍 Новое подтверждение участия!\n\n👤 Имя: ${name}\n✅ Ответ: ${statusText}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    // Отправляем сообщение каждому получателю
    const promises = RECIPIENTS.map(chatId =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      })
    );

    await Promise.all(promises);

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Ошибка:', error);
    return { statusCode: 500, body: 'Ошибка отправки' };
  }
};
