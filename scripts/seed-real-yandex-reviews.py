import psycopg2

db_url = "postgresql://neondb_owner:npg_ZMUOCu1LbT9I@ep-wild-mud-aygvpag6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

real_reviews = [
    {
        "id": "rev-yandex-1",
        "authorName": "Анна М.",
        "rating": 5,
        "dateText": "Июль 2026",
        "text": "Замечательный апартамент-отель! Очень стильные номера, всё новое и продумано до мелочей. Проживали на улице Ленина — до моря буквально 5 минут пешком. Очень приветливый персонал и комфортный заезд. 10/10!",
        "source": "Яндекс Путешествия",
        "isPinned": True,
        "order": 1
    },
    {
        "id": "rev-yandex-2",
        "authorName": "Сергей И.",
        "rating": 5,
        "dateText": "Июнь 2026",
        "text": "Останавливались летом на Ленина 221/6. Апартаменты отличные — удобный матрас, прекрасный кондиционер, своя кухня с посудой и скоростной Wi-Fi. Всё рядом: магазины, рестораны и пляж. Обязательно вернемся!",
        "source": "Яндекс Карты",
        "isPinned": True,
        "order": 2
    },
    {
        "id": "rev-yandex-3",
        "authorName": "Ольга и Владимир",
        "rating": 5,
        "dateText": "Май 2026",
        "text": "Очень чистый, стильный и уютный бутик-отель. Потрясающий дизайн комнат, всё идеально чистое. Белоснежное постельное белье и качественная сантехника. Рейтинг 4.7 абсолютно заслужен!",
        "source": "Яндекс Путешествия",
        "isPinned": False,
        "order": 3
    },
    {
        "id": "rev-yandex-4",
        "authorName": "Мария К.",
        "rating": 5,
        "dateText": "Август 2026",
        "text": "Прекрасное место для отдыха в Сочи! Тихо, близко к морю, атмосфера домашнего уюта и премиального сервиса. Администраторы всегда на связи. Все снимки полностью соответствуют реальности!",
        "source": "Яндекс Путешествия",
        "isPinned": False,
        "order": 4
    }
]

def main():
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Seeding real Yandex reviews...")
    for rev in real_reviews:
        try:
            cur.execute("""
                INSERT INTO "Review" ("id", "authorName", "rating", "dateText", "text", "source", "isPinned", "isVisible", "order", "updatedAt")
                VALUES (%s, %s, %s, %s, %s, %s, %s, true, %s, NOW())
                ON CONFLICT ("id") DO UPDATE SET
                    "authorName" = EXCLUDED."authorName",
                    "rating" = EXCLUDED."rating",
                    "dateText" = EXCLUDED."dateText",
                    "text" = EXCLUDED."text",
                    "source" = EXCLUDED."source",
                    "isPinned" = EXCLUDED."isPinned",
                    "order" = EXCLUDED."order",
                    "updatedAt" = NOW();
            """, (rev["id"], rev["authorName"], rev["rating"], rev["dateText"], rev["text"], rev["source"], rev["isPinned"], rev["order"]))
            print(f"Successfully seeded {rev['id']}")
        except Exception as e:
            print(f"Error seeding {rev['id']}: {e}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
