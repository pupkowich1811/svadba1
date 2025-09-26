// netlify/functions/telegram.js

const BOT_TOKEN = '8288274911:AAGuEGWP0j0gf6z2S9DogLlZtjUin9q2x0g'; // ← сюда вставь токен от @BotFather
const CHAT_ID = '5266091692';     // ← сюда вставь свой Telegram ID

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

    const message = `💍 Новое подтверждение участия!\n\nИмя: ${name}\nОтвет: ${statusText}`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'HTML' })
    });

    if (response.ok) {
      return { statusCode: 200, body: 'OK' };
    } else {
      console.error('Ошибка Telegram API:', await response.text());
      return { statusCode: 500, body: 'Ошибка отправки' };
    }
  } catch (error) {
    console.error('Ошибка обработки:', error);
    return { statusCode: 500, body: 'Ошибка сервера' };
  }
};