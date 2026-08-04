import psycopg2

db_url = "postgresql://neondb_owner:npg_ZMUOCu1LbT9I@ep-wild-mud-aygvpag6-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

def main():
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    cur = conn.cursor()
    
    cur.execute('SELECT id, "authorName", text FROM "Review"')
    rows = cur.fetchall()
    print("Current reviews in DB:")
    for row in rows:
        print(row)

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
