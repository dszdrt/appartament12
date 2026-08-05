import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db } from '../src/lib/db';

const realReviews = [
  {
    id: 'real-1',
    authorName: 'Екатерина В.',
    rating: 5,
    dateText: 'Июль 2026',
    text: 'Прекрасный бутик-отель! Проживали в номере «Морской». Идеальная чистота, всё новое, стильное и продуманное до мелочей. До моря 5 минут пешком. Очень приветливый персонал!',
    source: 'Яндекс Путешествия',
    isPinned: true,
    isVisible: true,
    order: 1,
  },
  {
    id: 'real-2',
    authorName: 'Сергей И.',
    rating: 5,
    dateText: 'Июнь 2026',
    text: 'Останавливались летом на Ленина 221/6. Апартаменты отличные — удобный матрас, прекрасный кондиционер, своя кухня с посудой и скоростной Wi-Fi. Всё рядом: магазины, рестораны и пляж. Обязательно вернемся!',
    source: 'Яндекс Карты',
    isPinned: true,
    isVisible: true,
    order: 2,
  },
  {
    id: 'real-3',
    authorName: 'Ольга и Владимир',
    rating: 5,
    dateText: 'Май 2026',
    text: 'Очень чистый, стильный и уютный отель. Потрясающий дизайн комнат, всё идеально чистое. Белоснежное постельное белье и качественная сантехника. Рейтинг 4.7 абсолютно заслужен!',
    source: 'Яндекс Путешествия',
    isPinned: false,
    isVisible: true,
    order: 3,
  },
  {
    id: 'real-4',
    authorName: 'Мария К.',
    rating: 5,
    dateText: 'Август 2026',
    text: 'Отличное место для отдыха в Сочи! Тихо, близко к морю, атмосфера домашнего уюта и премиального сервиса. Администраторы всегда на связи. Все фотографии полностью соответствуют реальности!',
    source: 'Яндекс Путешествия',
    isPinned: false,
    isVisible: true,
    order: 4,
  },
];

async function main() {
  console.log('Seeding real reviews...');
  for (const r of realReviews) {
    await db.review.upsert({
      where: { id: r.id },
      create: r,
      update: r,
    });
  }
  console.log('Real reviews seeded successfully!');
}

main().catch(console.error);
