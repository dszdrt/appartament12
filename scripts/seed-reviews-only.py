import psycopg2

db_url = "postgresql://neondb_owner:npg_ZMUOCu1LbT9I@ep-wild-mud-aygvpag6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

reviews_data = [
    {
        "id": "rev-1",
        "authorName": "Екатерина В.",
        "rating": 5,
        "dateText": "Июль 2026",
        "text": "Потрясающий отель! Жила в номере 'Япония' — невероятная атмосфера, продуманный стильный интерьер и идеальная чистота. До пляжа идти буквально минут 6 мимо уютных кафе. Обязательно вернемся снова!",
        "source": "Яндекс Путешествия",
        "isPinned": True,
        "order": 1
    },
    {
        "id": "rev-2",
        "authorName": "Михаил и Елена",
        "rating": 5,
        "dateText": "Июнь 2026",
        "text": "Отдыхали всей семьей в семейных апартаментах. Все новое, качественная сантехника, есть своя кухонька, стиральная машина и климат-контроль. Администрации отдельное спасибо за тёплый прием и подсказки по лучшим ресторанам рядом!",
        "source": "Яндекс Путешествия",
        "isPinned": True,
        "order": 2
    },
    {
        "id": "rev-3",
        "authorName": "Артем К.",
        "rating": 5,
        "dateText": "Май 2026",
        "text": "Выбрал номер 'Хай-тек' для рабочей поездки. Скоростной Wi-Fi ловит идеально, комната тихая, звукоизоляция отличная. Удобное расположение — до ж/д вокзала и аэропорта добрались очень быстро.",
        "source": "Островок",
        "isPinned": False,
        "order": 3
    },
    {
        "id": "rev-4",
        "authorName": "Ольга Смирнова",
        "rating": 5,
        "dateText": "Август 2026",
        "text": "Прекрасный бутик-отель! Были в номере 'Морской'. Белоснежное белье, удобный матрас, стильный дизайн до мелочей. В шаговой доступности море, магазины и рестораны. 10 из 10!",
        "source": "Яндекс Путешествия",
        "isPinned": False,
        "order": 4
    },
    {
        "id": "rev-5",
        "authorName": "Дмитрий П.",
        "rating": 5,
        "dateText": "Июнь 2026",
        "text": "Отличные апартаменты на улице Ленина. Тихо, чисто, приятно пахнет. Фотографии полностью соответствуют реальности. Удобный бесконтактный заезд и идеальное расположение в Адлере.",
        "source": "Яндекс Карта",
        "isPinned": False,
        "order": 5
    }
]

def main():
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("Seeding reviews...")
    for rev in reviews_data:
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
